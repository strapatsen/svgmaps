// src/core/ProjectManager.js
import { SafetyRuleManager } from '../modules/safety/SafetyRuleManager.js';

export class ProjectManager {
    constructor(eventManager) {
        this._eventManager = eventManager;
        this._currentProject = null;
        this._recentProjects = [];
        this._undoStack = [];
        this._redoStack = [];
        this._maxUndoSteps = 50;
        this._autoSaveInterval = null;
        this._autoSaveEnabled = true;
        this._autoSaveDelay = 30000;
        this._projectVersions = new Map();
        this._safetyRules = new SafetyRuleManager();
        
        this._initEventListeners();
        this._setupAutoSave();
        this._initSafetyRules();
    }

    /* ------------------------ Project Lifecycle ------------------------ */

    newProject(template = 'default') {
        const templates = this._getProjectTemplates();
        this._currentProject = this._createProjectFromTemplate(template, templates);
        
        this._resetUndoRedo();
        this._projectVersions.set(this._currentProject.id, []);
        
        this._eventManager.emit('project:created', this._currentProject);
        return this._currentProject;
    }

    saveProject(path = null) {
        if (!this._currentProject) return false;
        
        if (path) this._currentProject.path = path;
        this._updateProjectMetadata();
        
        const snapshot = this._createSnapshot();
        this._addVersionSnapshot(snapshot);
        
        try {
            if (this._currentProject.path) {
                window.electronAPI?.saveProject(this._currentProject.path, snapshot);
            }
            
            this._eventManager.emit('project:saved', { 
                path: this._currentProject.path, 
                manual: true 
            });
            return true;
        } catch (error) {
            this._handleError('project:save-error', error);
            return false;
        }
    }

    loadProject(data) {
        if (!this._validateProjectData(data)) return false;

        try {
            this._currentProject = data.project;
            this._resetUndoRedo();
            
            this._restoreSnapshots(data);
            this._loadSafetyRulesFromProject(data);
            
            this._eventManager.emit('project:loaded', this._currentProject);
            return true;
        } catch (error) {
            this._handleError('project:load-error', error);
            return false;
        }
    }

    loadFromFile(path) {
        try {
            const data = window.electronAPI?.loadProject(path);
            if (this.loadProject(data)) {
                this._currentProject.path = path;
                this._addRecentProject(path);
                return true;
            }
            return false;
        } catch (error) {
            this._handleError('project:load-error', error);
            return false;
        }
    }

    /* ------------------------ Undo/Redo System ------------------------ */

    undo() {
        if (this._undoStack.length === 0) return false;
        
        const action = this._undoStack.pop();
        this._applyUndoRedo(action, true);
        this._redoStack.push(action);
        
        this._eventManager.emit('project:undo', action);
        return true;
    }

    redo() {
        if (this._redoStack.length === 0) return false;
        
        const action = this._redoStack.pop();
        this._applyUndoRedo(action, false);
        this._undoStack.push(action);
        
        this._eventManager.emit('project:redo', action);
        return true;
    }

    /* ------------------------ Safety Management ------------------------ */

    updateSafetyRules(countryCode, customRules = {}) {
        this._safetyRules.loadRules(countryCode, customRules);
        this._eventManager.emit('safety-rules:updated', 
            this._safetyRules.getCurrentRules()
        );
        this.validateSafetyCompliance();
    }

    validateSafetyCompliance() {
        if (!this._currentProject) return null;
        
        const elements = this._eventManager.elementManager?.getAllElements() || [];
        const attendees = this._currentProject.attendees || 0;
        const walkableArea = this._calculateWalkableArea(elements);
        
        const report = this._safetyRules.validate(elements, attendees, walkableArea);
        this._eventManager.emit('safety:validation-complete', report);
        
        return report;
    }

    setExpectedAttendees(count) {
        if (!this._currentProject) return;
        
        this._currentProject.attendees = Math.max(0, parseInt(count) || 0);
        this._eventManager.emit('project:attendees-changed', 
            this._currentProject.attendees
        );
        this.validateSafetyCompliance();
    }

    /* ------------------------ Version Control ------------------------ */

    revertToVersion(versionIndex) {
        if (!this._currentProject) return false;
        
        const versions = this._projectVersions.get(this._currentProject.id);
        if (!versions || versionIndex < 0 || versionIndex >= versions.length) return false;
        
        this.pushUndoState('project:reverted', { version: versionIndex });
        this.loadProject(versions[versionIndex].snapshot);
        
        this._eventManager.emit('project:reverted', versionIndex);
        return true;
    }

    /* ------------------------ Export Methods ------------------------ */

    exportProject(format, options = {}) {
        if (!this._currentProject) return false;
        
        const exporters = {
            png: this._exportToPNG.bind(this),
            svg: this._exportToSVG.bind(this),
            pdf: this._exportToPDF.bind(this),
            dxf: this._exportToDXF.bind(this)
        };

        try {
            const exporter = exporters[format];
            if (!exporter) throw new Error(`Unsupported export format: ${format}`);
            
            const result = exporter(options);
            this._eventManager.emit('project:exported', { format, ...result });
            return true;
        } catch (error) {
            this._handleError('project:export-error', error);
            return false;
        }
    }

    /* ------------------------ Helper Methods ------------------------ */

    hasUnsavedChanges() {
        if (!this._currentProject) return false;
        const versions = this._projectVersions.get(this._currentProject.id);
        return versions && versions.length > 0;
    }

    getProjectInfo() {
        if (!this._currentProject) return null;
        
        return {
            id: this._currentProject.id,
            name: this._currentProject.name,
            path: this._currentProject.path,
            createdAt: this._currentProject.createdAt,
            lastModified: this._currentProject.lastModified,
            version: this._currentProject.version,
            stats: {
                layers: this._eventManager.layerManager?.layers.length || 0,
                elements: this._eventManager.elementManager?.getElementCount() || 0,
                memory: this._getProjectMemoryUsage()
            }
        };
    }

    /* ------------------------ Private Methods ------------------------ */

    _initEventListeners() {
        const events = [
            'element:modified',
            'element:added', 
            'element:removed',
            'layer:modified',
            'project:settings-changed'
        ];
        
        events.forEach(event => {
            this._eventManager.on(event, data => 
                this.pushUndoState(event, data)
            );
        });
    }

    _initSafetyRules() {
        this._safetyRules.loadRules('NL', {});
    }

    _createProjectFromTemplate(template, templates) {
        const selectedTemplate = templates[template] || templates.default;
        const project = JSON.parse(JSON.stringify(selectedTemplate));
        
        project.id = `project-${Date.now()}`;
        project.createdAt = new Date().toISOString();
        project.lastModified = project.createdAt;
        project.path = null;
        project.version = 1;
        
        return project;
    }

    _getProjectTemplates() {
        return {
            default: {
                name: 'Untitled Project',
                width: 2000,
                height: 1200,
                scale: { pixels: 100, meters: 1 },
                gridSize: 20,
                backgroundColor: '#f0f0f0',
                defaultUnits: 'meters',
                attendees: 0,
                safetyRules: { countryCode: 'NL', customRules: {} }
            },
            architectural: {
                name: 'Architectural Plan',
                width: 5000,
                height: 3000,
                scale: { pixels: 100, meters: 0.5 },
                gridSize: 50,
                backgroundColor: '#ffffff',
                defaultUnits: 'centimeters',
                attendees: 0,
                safetyRules: { countryCode: 'NL', customRules: {} }
            },
            landscape: {
                name: 'Landscape Design',
                width: 3000,
                height: 2000,
                scale: { pixels: 100, meters: 2 },
                gridSize: 100,
                backgroundColor: '#e8f5e9',
                defaultUnits: 'meters',
                attendees: 0,
                safetyRules: { countryCode: 'NL', customRules: {} }
            }
        };
    }

    _createSnapshot() {
        return {
            project: JSON.parse(JSON.stringify(this._currentProject)),
            layers: this._eventManager.layerManager?.getSnapshot() || [],
            elements: this._eventManager.elementManager?.getSnapshot() || [],
            viewport: this._eventManager.viewportManager?.getSnapshot() || null
        };
    }

    _restoreSnapshots(data) {
        this._eventManager.layerManager?.restoreSnapshot(data.layers);
        this._eventManager.elementManager?.restoreSnapshot(data.elements);
        this._eventManager.viewportManager?.restoreSnapshot(data.viewport || {});
    }

    _loadSafetyRulesFromProject(data) {
        if (data.project.safetyRules) {
            this._safetyRules.loadRules(
                data.project.safetyRules.countryCode,
                data.project.safetyRules.customRules
            );
            this._currentProject.attendees = data.project.safetyRules.attendees || 0;
        }
    }

    _validateProjectData(data) {
        return data?.project && data?.layers && data?.elements;
    }

    _updateProjectMetadata() {
        this._currentProject.lastModified = new Date().toISOString();
        this._currentProject.version++;
        
        if (this._currentProject) {
            this._currentProject.safetyRules = {
                ...this._safetyRules.getCurrentRules(),
                attendees: this._currentProject.attendees || 0
            };
        }
    }

    _addVersionSnapshot(snapshot) {
        if (!this._currentProject) return;
        
        const versions = this._projectVersions.get(this._currentProject.id) || [];
        versions.push({ 
            timestamp: new Date().toISOString(), 
            snapshot 
        });
        
        while (versions.length > 20) versions.shift();
        this._projectVersions.set(this._currentProject.id, versions);
    }

    _resetUndoRedo() {
        this._undoStack = [];
        this._redoStack = [];
    }

    _applyUndoRedo(action, isUndo) {
        const handlers = {
            'element:added': () => {
                isUndo 
                    ? this._eventManager.elementManager?.removeElement(action.data.id)
                    : this._eventManager.elementManager?.restoreElement(action.data);
            },
            'element:removed': () => {
                isUndo 
                    ? this._eventManager.elementManager?.restoreElement(action.data)
                    : this._eventManager.elementManager?.removeElement(action.data.id);
            },
            'element:modified': () => {
                const current = this._eventManager.elementManager?.getElementById(action.data.id);
                this._eventManager.elementManager?.updateElement(
                    action.data.id, 
                    isUndo ? action.previous : action.data
                );
                action.previous = current;
            },
            'layer:modified': () => {
                const currentLayer = this._eventManager.layerManager?.getLayer(action.data.id);
                this._eventManager.layerManager?.updateLayer(
                    action.data.id, 
                    isUndo ? action.previous : action.data
                );
                action.previous = currentLayer;
            },
            'project:settings-changed': () => {
                const currentSettings = {...this._currentProject};
                Object.assign(this._currentProject, 
                    isUndo ? action.previous : action.data
                );
                action.previous = currentSettings;
                this._eventManager.emit('project:settings-changed', this._currentProject);
            }
        };

        handlers[action.type]?.();
    }

    _calculateWalkableArea(elements) {
        if (!this._currentProject) return 0;
        
        const terrain = elements.find(el => el.type === 'terrain');
        const totalArea = terrain 
            ? terrain.width * terrain.height 
            : this._currentProject.width * this._currentProject.height;
        
        const occupiedArea = elements
            .filter(el => !['terrain', 'path', 'walkway'].includes(el.type))
            .reduce((sum, el) => sum + (el.width * el.height), 0);
        
        return Math.max(0, totalArea - occupiedArea);
    }

    _setupAutoSave() {
        if (this._autoSaveInterval) clearInterval(this._autoSaveInterval);
        if (!this._autoSaveEnabled) return;
        
        this._autoSaveInterval = setInterval(() => this._autoSave(), this._autoSaveDelay);
    }

    _autoSave() {
        if (!this._autoSaveEnabled || !this._currentProject) return;
        
        this._updateProjectMetadata();
        const snapshot = this._createSnapshot();
        this._addVersionSnapshot(snapshot);
        
        this._eventManager.emit('project:autosaved', { 
            version: this._currentProject.version 
        });
    }

    _exportToPNG(options) {
        const canvas = document.createElement('canvas');
        canvas.width = options.width || this._currentProject.width;
        canvas.height = options.height || this._currentProject.height;
        
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = this._currentProject.backgroundColor || '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        return {
            blob: canvas.toDataURL('image/png'),
            width: canvas.width,
            height: canvas.height
        };
    }

    _exportToSVG() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', this._currentProject.width);
        svg.setAttribute('height', this._currentProject.height);
        svg.setAttribute('viewBox', `0 0 ${this._currentProject.width} ${this._currentProject.height}`);
        
        const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bg.setAttribute('width', '100%');
        bg.setAttribute('height', '100%');
        bg.setAttribute('fill', this._currentProject.backgroundColor || '#ffffff');
        svg.appendChild(bg);
        
        return {
            data: new XMLSerializer().serializeToString(svg),
            width: svg.width.baseVal.value,
            height: svg.height.baseVal.value
        };
    }

    _exportToPDF() {
        return { 
            url: `data:application/pdf;base64,...`,
            pageSize: 'A4'
        };
    }

    _exportToDXF() {
        return {
            data: `0\nSECTION\n2\nHEADER\n...`,
            version: 'AC1015'
        };
    }

    _getProjectMemoryUsage() {
        try {
            return JSON.stringify({
                project: this._currentProject,
                layers: this._eventManager.layerManager?.layers || [],
                elements: this._eventManager.elementManager?.getAllElements() || []
            }).length;
        } catch {
            return 0;
        }
    }

    _addRecentProject(path) {
        this._recentProjects = this._recentProjects.filter(p => p.path !== path);
        this._recentProjects.unshift({ path, timestamp: Date.now() });
        
        if (this._recentProjects.length > 10) this._recentProjects.pop();
    }

    _handleError(event, error) {
        console.error(`ProjectManager error (${event}):`, error);
        this._eventManager.emit(event, error);
    }

    /* ------------------------ Public API ------------------------ */

    // Getters voor belangrijke properties
    get currentProject() { return this._currentProject; }
    get recentProjects() { return [...this._recentProjects]; }
    get undoStackSize() { return this._undoStack.length; }
    get redoStackSize() { return this._redoStack.length; }
    get autoSaveEnabled() { return this._autoSaveEnabled; }

    // Methodes die direct doorgegeven worden
    pushUndoState(type, data, previous = null) {
        if (!this._currentProject) return;
        
        const action = { type, data, timestamp: Date.now() };
        if (previous !== null) action.previous = previous;
        
        this._undoStack.push(action);
        if (this._undoStack.length > this._maxUndoSteps) this._undoStack.shift();
        
        this._redoStack = [];
    }

    setAutoSave(enabled, delay = null) {
        this._autoSaveEnabled = enabled;
        if (delay !== null) this._autoSaveDelay = delay;
        this._setupAutoSave();
    }

    clearRecentProjects() {
        this._recentProjects = [];
    }
}