// Editor.js

import { EventManager } from './EventManager.js';
import { ProjectManager } from './ProjectManager.js';
import { LayerManager } from './LayerManager.js';
import { ElementManager } from './ElementManager.js';
import { ViewportManager } from './ViewportManager.js';
import { ToolManager } from './ToolManager.js';
import { MenuSystem } from '../ui/components/MenuSystem.js';
import { ToolbarManager } from '../ui/components/ToolbarManager.js';
import { PluginManager } from '../plugins/PluginManager.js';
import { SideBar } from '../ui/components/SideBar.js';
import { RuleEngine } from '../modules/safety/rulesEngine.js';
import { SafetyVisualizer } from '../modules/safety/SafetyVisualizer.js';

/**
 * @class Editor
 * @classdesc The main class for the Terrain Editor application. This class serves as the central
 * point for managing core systems, modules, UI components, and event handling. It provides
 * functionality for initializing the editor, managing projects, handling safety compliance,
 * enabling 3D features, and supporting plugins.
 */
export class Editor {

    /* ------------------------ Constructor ------------------------ */
    constructor(config = {}) {
        // Merge config with defaults
        this.config = {
            enable3D: false,
            enablePlugins: true,
            autoSave: true,
            autoSaveInterval: 30000,
            locale: 'en-US',
            ...config
        };

        // Initialize core systems
        this._initCoreSystems();
        
        // Setup managers and modules
        this._setupManagers();
        this._initModules();
        
        // Initialize UI
        this._initUI();
        
        // Setup error handling and events
        this._setupErrorHandling();
        this._setupEventListeners();
    }

    /* ------------------------ Core Initialization ------------------------ */
    _initCoreSystems() {
        this.eventManager = new EventManager();
        this.projectManager = new ProjectManager(this);
        this.layerManager = new LayerManager(this);
        this.elementManager = new ElementManager(this);
        this.viewportManager = new ViewportManager(this);
        this.toolManager = new ToolManager(this);
    }

    _setupManagers() {
        // Project events
        this.eventManager.on('project:new', () => this.projectManager.createNew());
        this.eventManager.on('project:save', () => this.projectManager.save());
        this.eventManager.on('project:load', (file) => this.projectManager.load(file));
        
        // Tool events
        this.eventManager.on('tool:select', (tool) => {
            this.toolManager.setActiveTool(tool);
        });
        
        // Viewport events
        this.eventManager.on('viewport:zoom-in', () => this.viewportManager.zoomIn());
        this.eventManager.on('viewport:zoom-out', () => this.viewportManager.zoomOut());
        this.eventManager.on('viewport:zoom-reset', () => this.viewportManager.resetZoom());
    }

    /* ------------------------ Module Initialization ------------------------ */
    _initModules() {
        this.modules = {
            safety: this.config.safety?.enabled ? this._initSafetyModule() : null,
            crowd: this._initModule('crowd', 'CrowdSimulation'),
            staff: this._initModule('staff', 'ShiftPlanner'),
            view3d: null // Will be lazy-loaded
        };
    }

    _initSafetyModule() {
        try {
            this.ruleEngine = new RuleEngine(this, this.config.locale);
            this.safetyVisualizer = new SafetyVisualizer(this, this.ruleEngine);
            
            // Add safety layers to viewport
            this.viewportManager.addLayer(this.safetyVisualizer.layers.crowdControl);
            this.viewportManager.addLayer(this.safetyVisualizer.layers.personnel);
            
            // Load safety rules
            this._loadSafetyRules(this.config.locale);
            
            return {
                ruleEngine: this.ruleEngine,
                visualizer: this.safetyVisualizer
            };
        } catch (error) {
            console.error('Failed to initialize safety module:', error);
            this.eventManager.emit('module:error', {
                module: 'safety',
                error: error.message
            });
            return null;
        }
    }

    async _loadSafetyRules(country) {
        try {
            const response = await fetch(`./data/rules/${country}.json`);
            if (!response.ok) throw new Error('Failed to fetch rules');
            const rules = await response.json();
            this.ruleEngine.loadRules(rules);
            this.eventManager.emit('safety:rules-loaded', country);
        } catch (error) {
            console.error(`Failed to load ${country} safety rules:`, error);
            this.eventManager.emit('safety:rules-error', error);
        }
    }

    _initModule(moduleName, className) {
        try {
            const modulePath = `../modules/${moduleName}/${className}.js`;
            const module = require(modulePath);
            return new module[className](this);
        } catch (error) {
            console.error(`Failed to load ${moduleName} module:`, error);
            this.eventManager.emit('module:error', {
                module: moduleName,
                error: error.message
            });
            return null;
        }
    }

    /* ------------------------ UI Initialization ------------------------ */
    _initUI() {
        // Initialize UI components
        this.menuSystem = new MenuSystem(this);
        this.toolbarManager = new ToolbarManager(this);
        this.sideBar = new SideBar(this);
        
        // Setup canvas
        this.canvas = {
            main: document.getElementById('main-canvas'),
            temp: document.getElementById('temp-canvas'),
            container: document.getElementById('canvas-container')
        };
        
        // Setup drag and drop
        this._setupDragAndDrop();
    }

    _setupDragAndDrop() {
        if (!this.canvas.container) return;
        
        this.canvas.container.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });
        
        this.canvas.container.addEventListener('drop', (e) => {
            e.preventDefault();
            if (e.dataTransfer.files.length > 0) {
                this._handleFileDrop(e.dataTransfer.files);
            }
        });
    }

    _handleFileDrop(files) {
        Array.from(files).forEach(file => {
            const ext = file.name.split('.').pop().toLowerCase();
            if (['png', 'jpg', 'jpeg', 'svg'].includes(ext)) {
                this._importImageFile(file);
            } else if (ext === 'wmap') {
                this.eventManager.emit('project:load', file);
            }
        });
    }

    /* ------------------------ 3D Functionality ------------------------ */
    async enable3D() {
        if (this.modules.view3d) return this.modules.view3d;

        try {
            const { ThreeJSView } = await import('../modules/3d/ThreeJS.js');
            this.modules.view3d = new ThreeJSView(this);
            this.eventManager.emit('3d:enabled');
            return this.modules.view3d;
        } catch (error) {
            console.error('Failed to load 3D module:', error);
            this.eventManager.emit('3d:error', error);
            throw error;
        }
    }

    /* ------------------------ Plugin System ------------------------ */
    async _initPlugins() {
        if (!this.config.enablePlugins) return;
        
        this.plugins = new Map();
        
        // Built-in plugins
        const builtins = [
            { name: 'Measurement', path: '../plugins/builtin/MeasurementPlugin.js' },
            { name: 'ImportExport', path: '../plugins/builtin/ImportExportPlugin.js' },
            { name: 'PluginManager', path: '../plugins/builtin/PluginManagerPlugin.js' }
        ];

        for (const plugin of builtins) {
            try {
                const module = await import(plugin.path);
                this.plugins.set(plugin.name, new module.default(this));
                this.eventManager.emit('plugin:loaded', plugin.name);
            } catch (error) {
                this._handlePluginError(plugin.name, error);
            }
        }
    }

    _handlePluginError(name, error) {
        console.error(`Plugin ${name} error:`, error);
        this.eventManager.emit('plugin:error', {
            name,
            error: error.message
        });
    }

    /* ------------------------ Safety Validation ------------------------ */
    validateSafetyCompliance() {
        if (!this.modules.safety) return null;
        
        const elements = this.elementManager.getAllElements();
        const project = this.projectManager.currentProject;
        
        const report = this.modules.safety.ruleEngine.validateProject(project, elements);
        this.modules.safety.visualizer.update(report.violations);
        
        this.eventManager.emit('safety:validation-complete', report);
        return report;
    }

    /* ------------------------ Event Handling ------------------------ */
    _setupEventListeners() {
        // Project events
        this.eventManager.on('project:loaded', () => this._onProjectLoaded());
        this.eventManager.on('project:created', () => this._onProjectLoaded());
        
        // Element events
        this.eventManager.on('element:selected', (el) => this._showElementProperties(el));
        
        // Safety events
        this.eventManager.on('safety:validation-complete', (report) => {
            this._displaySafetyReport(report);
        });
        
        // Window events
        window.addEventListener('resize', () => this.viewportManager.handleResize());
        window.addEventListener('beforeunload', (e) => {
            if (this.projectManager.hasUnsavedChanges()) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    _setupErrorHandling() {
        window.onerror = (message, source, lineno, colno, error) => {
            this.eventManager.emit('app:error', { 
                message, 
                error,
                source,
                line: lineno,
                column: colno
            });
            return true;
        };
        
        this.eventManager.on('app:error', (error) => {
            this._showError(error);
        });
    }

    /* ------------------------ Project Lifecycle ------------------------ */
    async start() {
        try {
            // Load initial project
            await this.projectManager.loadInitialProject();
            
            // Set default tool
            this.toolManager.setDefaultTool('select');
            
            // Initialize viewport
            this.viewportManager.initialize();
            
            // Initialize plugins
            await this._initPlugins();
            
            // Emit ready event
            this.eventManager.emit('editor:ready');
        } catch (error) {
            console.error('Failed to start editor:', error);
            this.eventManager.emit('editor:error', error);
        }
    }

    _onProjectLoaded() {
        this.viewportManager.fitToView();
        this._updateUIState();
        
        if (this.config.autoSave) {
            this.projectManager.setAutoSave(true, this.config.autoSaveInterval);
        }
        
        if (this.modules.safety) {
            this.validateSafetyCompliance();
        }
    }

    _updateUIState() {
        this.menuSystem.updateMenuState();
        this.toolbarManager.updateButtonStates();
        this.sideBar.updateContent();
    }

    /* ------------------------ Utility Methods ------------------------ */
    _showError(error) {
        console.error('Application error:', error);
        const errorDialog = document.getElementById('error-dialog');
        if (errorDialog) {
            errorDialog.querySelector('.error-message').textContent = error.message;
            if (error.stack) {
                errorDialog.querySelector('.error-stack').textContent = error.stack;
            }
            errorDialog.style.display = 'block';
        }
    }

    _displaySafetyReport(report) {
        const panel = document.getElementById('safety-panel');
        if (!panel) return;
        
        panel.innerHTML = `
            <div class="safety-report">
                <h3>Safety Compliance Report</h3>
                <div class="summary ${report.compliant ? 'compliant' : 'non-compliant'}">
                    ${report.compliant ? '✓ Compliant' : '✗ Non-compliant'}
                </div>
                <div class="violations">
                    ${report.violations.length > 0 ? `
                        <h4>Violations (${report.violations.length})</h4>
                        <ul>
                            ${report.violations.map(v => `
                                <li class="violation" data-id="${v.id}">
                                    <strong>${v.ruleId}</strong>: ${v.message}
                                </li>
                            `).join('')}
                        </ul>
                    ` : '<p>No violations found</p>'}
                </div>
            </div>
        `;
    }
}