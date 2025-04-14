class ProjectManager {
    constructor(eventManager) {
      this.eventManager = eventManager;
      this.currentProject = null;
      this.recentProjects = [];
      this.undoStack = [];
      this.redoStack = [];
      this.maxUndoSteps = 50;
      this.autoSaveInterval = null;
      this.autoSaveEnabled = true;
      this.autoSaveDelay = 30000;
      this.projectVersions = new Map();
      this.init();
    }
  
    init() {
      this.setupAutoSave();
      this.eventManager.on('element:modified', element => this.pushUndoState('element:modified', element));
      this.eventManager.on('element:added', element => this.pushUndoState('element:added', element));
      this.eventManager.on('element:removed', element => this.pushUndoState('element:removed', element));
      this.eventManager.on('layer:modified', layer => this.pushUndoState('layer:modified', layer));
      this.eventManager.on('project:settings-changed', settings => this.pushUndoState('project:settings-changed', settings));
    }
  
    newProject(template = 'default') {
      const templates = {
        default: {
          name: 'Untitled Project',
          width: 2000,
          height: 1200,
          scale: { pixels: 100, meters: 1 },
          gridSize: 20,
          backgroundColor: '#f0f0f0',
          defaultUnits: 'meters'
        },
        architectural: {
          name: 'Architectural Plan',
          width: 5000,
          height: 3000,
          scale: { pixels: 100, meters: 0.5 },
          gridSize: 50,
          backgroundColor: '#ffffff',
          defaultUnits: 'centimeters'
        },
        landscape: {
          name: 'Landscape Design',
          width: 3000,
          height: 2000,
          scale: { pixels: 100, meters: 2 },
          gridSize: 100,
          backgroundColor: '#e8f5e9',
          defaultUnits: 'meters'
        }
      };
  
      this.currentProject = JSON.parse(JSON.stringify(templates[template] || templates.default));
      this.currentProject.id = `project-${Date.now()}`;
      this.currentProject.createdAt = new Date().toISOString();
      this.currentProject.lastModified = this.currentProject.createdAt;
      this.currentProject.path = null;
      this.currentProject.version = 1;
      
      this.undoStack = [];
      this.redoStack = [];
      this.projectVersions.set(this.currentProject.id, []);
      
      this.eventManager.emit('project:created', this.currentProject);
      return this.currentProject;
    }
  
    saveProject(path = null) {
      if (!this.currentProject) return false;
  
      if (path) this.currentProject.path = path;
      this.currentProject.lastModified = new Date().toISOString();
      
      const snapshot = {
        project: JSON.parse(JSON.stringify(this.currentProject)),
        layers: this.eventManager.layerManager.getSnapshot(),
        elements: this.eventManager.elementManager.getSnapshot(),
        viewport: this.eventManager.viewportManager.getSnapshot()
      };
  
      try {
        if (this.currentProject.path) {
          window.electronAPI.saveProject(this.currentProject.path, snapshot);
        }
        
        this.addVersionSnapshot(snapshot);
        this.eventManager.emit('project:saved', { path: this.currentProject.path, manual: true });
        return true;
      } catch (error) {
        this.eventManager.emit('project:save-error', error);
        return false;
      }
    }
  
    autoSave() {
      if (!this.autoSaveEnabled || !this.currentProject) return;
      this.currentProject.lastModified = new Date().toISOString();
      this.currentProject.version++;
      
      const snapshot = {
        project: JSON.parse(JSON.stringify(this.currentProject)),
        layers: this.eventManager.layerManager.getSnapshot(),
        elements: this.eventManager.elementManager.getSnapshot(),
        viewport: this.eventManager.viewportManager.getSnapshot()
      };
  
      this.addVersionSnapshot(snapshot);
      this.eventManager.emit('project:autosaved', { version: this.currentProject.version });
    }
  
    addVersionSnapshot(snapshot) {
      if (!this.currentProject) return;
      
      const versions = this.projectVersions.get(this.currentProject.id) || [];
      versions.push({ timestamp: new Date().toISOString(), snapshot });
      
      while (versions.length > 20) versions.shift();
      this.projectVersions.set(this.currentProject.id, versions);
    }
  
    loadProject(data) {
      if (!data.project || !data.layers || !data.elements) return false;
  
      try {
        this.currentProject = data.project;
        this.undoStack = [];
        this.redoStack = [];
        
        this.eventManager.layerManager.restoreSnapshot(data.layers);
        this.eventManager.elementManager.restoreSnapshot(data.elements);
        
        if (data.viewport) {
          this.eventManager.viewportManager.restoreSnapshot(data.viewport);
        }
        
        this.eventManager.emit('project:loaded', this.currentProject);
        return true;
      } catch (error) {
        this.eventManager.emit('project:load-error', error);
        return false;
      }
    }
  
    loadFromFile(path) {
      try {
        const data = window.electronAPI.loadProject(path);
        if (this.loadProject(data)) {
          this.currentProject.path = path;
          return true;
        }
        return false;
      } catch (error) {
        this.eventManager.emit('project:load-error', error);
        return false;
      }
    }
  
    exportProject(format, options) {
      if (!this.currentProject) return false;
      
      const exportData = {
        project: this.currentProject,
        layers: this.eventManager.layerManager.getSnapshot(),
        elements: this.eventManager.elementManager.getSnapshot()
      };
  
      try {
        let result;
        switch (format) {
          case 'png':
            result = this.exportToPNG(exportData, options);
            break;
          case 'svg':
            result = this.exportToSVG(exportData, options);
            break;
          case 'pdf':
            result = this.exportToPDF(exportData, options);
            break;
          case 'dxf':
            result = this.exportToDXF(exportData, options);
            break;
          default:
            throw new Error(`Unsupported export format: ${format}`);
        }
        
        this.eventManager.emit('project:exported', { format, ...result });
        return true;
      } catch (error) {
        this.eventManager.emit('project:export-error', error);
        return false;
      }
    }
  
    exportToPNG(data, options) {
      const canvas = document.createElement('canvas');
      canvas.width = options.width || data.project.width;
      canvas.height = options.height || data.project.height;
      
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = data.project.backgroundColor || '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      return {
        blob: canvas.toDataURL('image/png'),
        width: canvas.width,
        height: canvas.height
      };
    }
  
    exportToSVG(data, options) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', options.width || data.project.width);
      svg.setAttribute('height', options.height || data.project.height);
      svg.setAttribute('viewBox', `0 0 ${data.project.width} ${data.project.height}`);
      
      const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bg.setAttribute('width', '100%');
      bg.setAttribute('height', '100%');
      bg.setAttribute('fill', data.project.backgroundColor || '#ffffff');
      svg.appendChild(bg);
      
      return {
        data: new XMLSerializer().serializeToString(svg),
        width: svg.width.baseVal.value,
        height: svg.height.baseVal.value
      };
    }
  
    exportToPDF(data, options) {
      return { 
        url: `data:application/pdf;base64,...`,
        pageSize: options.pageSize || 'A4'
      };
    }
  
    exportToDXF(data, options) {
      return {
        data: `0\nSECTION\n2\nHEADER\n...`,
        version: options.version || 'AC1015'
      };
    }
  
    getProjectInfo() {
      if (!this.currentProject) return null;
      
      return {
        id: this.currentProject.id,
        name: this.currentProject.name,
        path: this.currentProject.path,
        createdAt: this.currentProject.createdAt,
        lastModified: this.currentProject.lastModified,
        version: this.currentProject.version,
        stats: {
          layers: this.eventManager.layerManager.layers.length,
          elements: this.eventManager.elementManager.getElementCount(),
          memory: this.getProjectMemoryUsage()
        }
      };
    }
  
    getProjectMemoryUsage() {
      try {
        return JSON.stringify({
          project: this.currentProject,
          layers: this.eventManager.layerManager.layers,
          elements: this.eventManager.elementManager.getAllElements()
        }).length;
      } catch {
        return 0;
      }
    }
  
    undo() {
      if (this.undoStack.length === 0) return false;
      
      const action = this.undoStack.pop();
      this.applyUndoRedo(action, true);
      this.redoStack.push(action);
      
      this.eventManager.emit('project:undo', action);
      return true;
    }
  
    redo() {
      if (this.redoStack.length === 0) return false;
      
      const action = this.redoStack.pop();
      this.applyUndoRedo(action, false);
      this.undoStack.push(action);
      
      this.eventManager.emit('project:redo', action);
      return true;
    }
  
    applyUndoRedo(action, isUndo) {
      switch (action.type) {
        case 'element:added':
          isUndo 
            ? this.eventManager.elementManager.removeElement(action.data.id)
            : this.eventManager.elementManager.restoreElement(action.data);
          break;
        
        case 'element:removed':
          isUndo 
            ? this.eventManager.elementManager.restoreElement(action.data)
            : this.eventManager.elementManager.removeElement(action.data.id);
          break;
        
        case 'element:modified':
          const current = this.eventManager.elementManager.getElementById(action.data.id);
          this.eventManager.elementManager.updateElement(action.data.id, isUndo ? action.previous : action.data);
          action.previous = current;
          break;
        
        case 'layer:modified':
          const currentLayer = this.eventManager.layerManager.getLayer(action.data.id);
          this.eventManager.layerManager.updateLayer(action.data.id, isUndo ? action.previous : action.data);
          action.previous = currentLayer;
          break;
        
        case 'project:settings-changed':
          const currentSettings = {...this.currentProject};
          Object.assign(this.currentProject, isUndo ? action.previous : action.data);
          action.previous = currentSettings;
          this.eventManager.emit('project:settings-changed', this.currentProject);
          break;
      }
    }
  
    pushUndoState(type, data, previous = null) {
      if (!this.currentProject) return;
      
      const action = { type, data, timestamp: Date.now() };
      if (previous !== null) action.previous = previous;
      
      this.undoStack.push(action);
      if (this.undoStack.length > this.maxUndoSteps) this.undoStack.shift();
      
      this.redoStack = [];
    }
  
    setupAutoSave() {
      if (this.autoSaveInterval) clearInterval(this.autoSaveInterval);
      if (!this.autoSaveEnabled) return;
      
      this.autoSaveInterval = setInterval(() => this.autoSave(), this.autoSaveDelay);
    }
  
    setAutoSave(enabled, delay = null) {
      this.autoSaveEnabled = enabled;
      if (delay !== null) this.autoSaveDelay = delay;
      this.setupAutoSave();
    }
  
    revertToVersion(versionIndex) {
      if (!this.currentProject) return false;
      
      const versions = this.projectVersions.get(this.currentProject.id);
      if (!versions || versionIndex < 0 || versionIndex >= versions.length) return false;
      
      const version = versions[versionIndex];
      this.pushUndoState('project:reverted', { version: versionIndex });
      
      this.loadProject(version.snapshot);
      this.eventManager.emit('project:reverted', versionIndex);
      return true;
    }
  
    getRecentProjects() {
      return this.recentProjects;
    }
  
    addRecentProject(path) {
      this.recentProjects = this.recentProjects.filter(p => p.path !== path);
      this.recentProjects.unshift({ path, timestamp: Date.now() });
      
      if (this.recentProjects.length > 10) this.recentProjects.pop();
    }
  
    clearRecentProjects() {
      this.recentProjects = [];
    }
}