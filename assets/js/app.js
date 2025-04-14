// Terrain Editor Application
// -------------------------------------------------------------------
// This file contains the main application logic for the Terrain Editor.
// It initializes the application, sets up event listeners, manages the project lifecycle,
// and handles user interactions.
// It also manages the UI components and integrates with the underlying data models.
// The application is designed to be modular, allowing for easy integration of plugins and extensions.
// The code is structured to separate concerns, with different classes handling different aspects of the application.
// The main classes include EventManager, ProjectManager, LayerManager, ElementManager, ViewportManager, ToolManager, and MenuSystem.
// Each class is responsible for a specific part of the application, making it easier to maintain and extend.
// The application is designed to be responsive and user-friendly, with drag-and-drop support for importing files,
// a properties panel for editing element properties, and a menu system for accessing various features.
// The application also includes error handling and logging mechanisms to help identify and resolve issues during development and usage.
// -------------------------------------------------------------------
class ThemeManager {
  static current = 'default';

  static set(theme) {
      this.current = theme;
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('ui-theme', theme);
  }
  
  static applyTheme() {
      this.init();
      this.addToggleButton();
  }

  static addToggleButton() {
      const button = document.createElement('button');
      button.innerText = 'Toggle Theme';
      button.addEventListener('click', () => this.toggleTheme());
      document.body.appendChild(button);
  }

  static toggleTheme() {
      const newTheme = this.current === 'default' ? 'dark' : 'default';
      this.set(newTheme);
  }
  
  static init() {
      const savedTheme = localStorage.getItem('ui-theme') || 'default';
      this.set(savedTheme);
      this.addToggleButton();
  }
}
class TerrainEditorApp {
  constructor(config = {}) {
    this.config = {
      enablePlugins: true,
      defaultProjectTemplate: 'default',
      ...config
    };

    this.initManagers();
    this.initUI();
    this.setupEventListeners();
    this.setupErrorHandling();
    this.initPlugins();
  }

  initManagers() {
    this.eventManager = new EventManager();
    this.projectManager = new ProjectManager(this.eventManager);
    this.layerManager = new LayerManager(this.eventManager);
    this.elementManager = new ElementManager(this.eventManager);
    this.viewportManager = new ViewportManager(this.eventManager);
    this.toolManager = new ToolManager(this.eventManager);
    this.menuSystem = new MenuSystem(this.eventManager);
  }

  initUI() {
    this.ui = {
      canvas: document.getElementById('main-canvas'),
      propertiesPanel: document.getElementById('properties-panel'),
      layersPanel: document.getElementById('layers-panel'),
      toolsPanel: document.getElementById('tools-panel')
    };

    this.setupDragAndDrop();
    this.setupResponsiveLayout();
  }

  setupEventListeners() {
    this.eventManager.on('project:loaded', () => this.onProjectLoaded());
    this.eventManager.on('project:created', () => this.onProjectLoaded());
    this.eventManager.on('element:selected', (el) => this.showElementProperties(el));
    this.eventManager.on('layer:selected', (layer) => this.showLayerProperties(layer));
    this.eventManager.on('tool:changed', (tool) => this.updateActiveTool(tool));

    window.addEventListener('resize', () => this.handleResize());
    window.addEventListener('beforeunload', (e) => {
      if (this.projectManager.hasUnsavedChanges()) {
        e.preventDefault();
        return e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    });
  }

  setupErrorHandling() {
    window.onerror = (message, source, lineno, colno, error) => {
      this.eventManager.emit('app:error', { message, error });
      return true;
    };

    this.eventManager.on('project:error', (error) => this.showError(error));
    this.eventManager.on('export:error', (error) => this.showError(error));
  }

  initPlugins() {
    if (!this.config.enablePlugins) return;

    this.plugins = new Map();
    this.loadBuiltinPlugins();
    this.loadExternalPlugins();
  }

  loadBuiltinPlugins() {
    const builtins = [
      'MeasurementPlugin',
      'ImportExportPlugin',
      'TerrainGeneratorPlugin'
    ];

    builtins.forEach(name => {
      try {
        const plugin = new window[name](this.eventManager);
        this.plugins.set(name, plugin);
        this.eventManager.emit('plugin:loaded', { name, type: 'builtin' });
      } catch (error) {
        console.error(`Failed to load builtin plugin ${name}:`, error);
      }
    });
  }

  loadExternalPlugins() {
    if (!window.electronAPI) return;

    try {
      const plugins = window.electronAPI.loadPlugins();
      plugins.forEach(plugin => {
        try {
          const instance = new plugin.module(this.eventManager);
          this.plugins.set(plugin.name, instance);
          this.menuSystem.addPluginMenuItem(plugin.name, plugin.menuItems || {});
          this.eventManager.emit('plugin:loaded', { name: plugin.name, type: 'external' });
        } catch (error) {
          console.error(`Failed to load plugin ${plugin.name}:`, error);
        }
      });
    } catch (error) {
      console.error('Failed to load external plugins:', error);
    }
  }

  onProjectLoaded() {
    this.viewportManager.fitToView();
    this.updateUIState();
    this.setupAutoSave();
  }

  showElementProperties(element) {
    const typeDef = elementManager.getTypeDefinition(element.type);

    const panel = this.ui.propertiesPanel;
    panel.innerHTML = `
        <h3>${element.type} Properties</h3>
        <div class="property-group">
          <label>Name</label>
          <input type="text" data-property="name" value="${element.name}">
        </div>
        <div class="property-group">
          <label>Type</label>
          <select data-property="type">
        ${this.elementManager.elementTypes
        .map(group => `
        <optgroup label="${group.label}">
          ${group.types
            .map(type => `<option value="${type.value}" ${type.value === element.type ? 'selected' : ''}>${type.label || type.value}</option>`)
            .join('')}
        </optgroup>
          `)
        .join('')}
          </select>
        </div>
        <div class="property-group">
          <label>Color</label>
          <input type="color" data-property="color" value="${element.color}">
        </div>
        <div class="property-group">
          <label>Opacity</label>
          <input type="range" data-property="opacity" min="0" max="1" step="0.01" value="${element.opacity}">
        </div>
        <div class="property-group">
          <label>Width</label>
          <input type="number" data-property="width" value="${element.width}">
        </div>
        <div class="property-group">
          <label>Height</label>
          <input type="number" data-property="height" value="${element.height}">
        </div>
        <div class="property-group">
          <label>Position X</label>
          <input type="number" data-property="x" value="${element.x}">
        </div>
        <div class="property-group">
          <label>Position Y</label>
          <input type="number" data-property="y" value="${element.y}">
        </div>
        <div class="property-group">
          <label>Scale X</label>
          <input type="number" data-property="scaleX" value="${element.scaleX}">
        </div>
        <div class="property-group">
          <label>Scale Y</label>
          <input type="number" data-property="scaleY" value="${element.scaleY}">
        </div>
        <div class="property-group">
          <label>Rotation</label>
          <input type="number" data-property="rotation" value="${element.rotation}">
        </div>
        <div class="property-group">
          <label>Metadata</label>
          <textarea data-property="metadata">${JSON.stringify(element.metadata, null, 2)}</textarea>
        </div>
        <div class="property-group">
          <label>
        <input type="checkbox" data-property="locked" ${element.locked ? 'checked' : ''}>
        Locked
          </label>
        </div>
        <div class="property-group">
          <label>
        <input type="checkbox" data-property="visible" ${element.visible ? 'checked' : ''}>
        Visible
          </label>
        </div>
        <div class="property-group">
          <button data-action="duplicate">Duplicate</button>
        </div>
        <div class="property-group">
          <button data-action="export">Export</button>
        </div>
        <div class="property-group">
          <button data-action="import">Import</button>
        </div>
        <div class="property-group">
          <button data-action="delete">Delete</button>
        </div>
      `;

    panel.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('change', (e) => {
        const value = input.type === 'checkbox' ? input.checked : input.value;
        this.elementManager.updateElement(element.id, {
          [e.target.dataset.property]: value
        });
      });
    });

    panel.querySelector('[data-action="duplicate"]').addEventListener('click', () => {
      this.elementManager.duplicateElement(element.id);
    });

    panel.querySelector('[data-action="export"]').addEventListener('click', () => {
      this.elementManager.exportElement(element.id);
    });

    panel.querySelector('[data-action="import"]').addEventListener('click', () => {
      this.elementManager.importElement();
    });

    panel.querySelector('[data-action="delete"]').addEventListener('click', () => {
      this.elementManager.deleteElement(element.id);
    });

    panel.querySelectorAll('input').forEach(input => {
      input.addEventListener('change', (e) => {
        this.elementManager.updateElement(element.id, {
          [e.target.dataset.property]: e.target.value
        });
      });
    });
  }

  showLayerProperties(layer) {
    const panel = this.ui.propertiesPanel;
    panel.innerHTML = `
        <h3>Layer Properties</h3>
        <div class="property-group">
          <label>Name</label>
          <input type="text" data-property="name" value="${layer.name}">
        </div>
        <div class="property-group">
          <label>
            <input type="checkbox" data-property="visible" ${layer.visible ? 'checked' : ''}>
            Visible
          </label>
        </div>
        <div class="property-group">
          <label>
            <input type="checkbox" data-property="locked" ${layer.locked ? 'checked' : ''}>
            Locked
          </label>
        </div>
      `;

    panel.querySelectorAll('input').forEach(input => {
      input.addEventListener('change', (e) => {
        this.layerManager.updateLayer(layer.id, {
          [e.target.dataset.property]: input.type === 'checkbox' ? input.checked : input.value
        });
      });
    });
  }

  updateActiveTool(toolName) {
    document.querySelectorAll('.tool-button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tool === toolName);
    });
  }

  updateUIState() {
    this.menuSystem.updateMenuState();
    this.viewportManager.redraw();
  }

  setupAutoSave() {
    this.projectManager.setAutoSave(true, 60000);
  }

  setupDragAndDrop() {
    const canvas = this.ui.canvas;

    canvas.addEventListener('dragover', (e) => {
      e.preventDefault();
      canvas.classList.add('drag-over');
    });

    canvas.addEventListener('dragleave', () => {
      canvas.classList.remove('drag-over');
    });

    canvas.addEventListener('drop', (e) => {
      e.preventDefault();
      canvas.classList.remove('drag-over');

      if (e.dataTransfer.files.length > 0) {
        this.handleFileDrop(e.dataTransfer.files);
      }
    });
  }

  handleFileDrop(files) {
    Array.from(files).forEach(file => {
      const ext = file.name.split('.').pop().toLowerCase();

      if (['png', 'jpg', 'jpeg', 'svg'].includes(ext)) {
        this.importImageFile(file);
      } else if (ext === 'terrain') {
        this.projectManager.loadFromFile(file.path);
      }
    });
  }

  importImageFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const element = this.elementManager.createElement(
          'image',
          'image',
          100, 100,
          img.width, img.height,
          { src: e.target.result }
        );
        this.eventManager.emit('element:add-to-layer', element);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  setupResponsiveLayout() {
    const resizeObserver = new ResizeObserver(() => {
      this.viewportManager.handleResize();
    });

    resizeObserver.observe(document.getElementById('app-container'));
  }

  handleResize() {
    this.viewportManager.handleResize();
  }

  showError(error) {
    console.error('Application error:', error);

    const errorDialog = document.getElementById('error-dialog');
    errorDialog.querySelector('.error-message').textContent = error.message;
    errorDialog.querySelector('.error-stack').textContent = error.stack;
    errorDialog.style.display = 'block';

    errorDialog.querySelector('.close-button').addEventListener('click', () => {
      errorDialog.style.display = 'none';
    });
  }

  start() {
    this.projectManager.newProject(this.config.defaultProjectTemplate);
    this.eventManager.emit('app:started');
  }
}
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
        const currentSettings = { ...this.currentProject };
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
class ElementManager {

  constructor(eventManager, layerManager) {
    this.elementTypes = [];
    this.loadElementTypes();
    this.eventManager = eventManager;
    this.layerManager = layerManager;
    this.selectedElement = null;
    this.hoveredElement = null;
    this.tempElement = null;
    this.elementCount = 0;
    this.lastPosition = null;

    this.setupEventListeners();
    this.initTools();

  }

  async loadElementTypes() {
    const response = await fetch('data/element-types.json');
    const data = await response.json();
    this.elementTypes = data.elementTypes;
  }

  setupEventListeners() {
    this.eventManager.on('canvas:click', (pos) => this.handleCanvasClick(pos));
    this.eventManager.on('canvas:drag', (pos) => this.handleCanvasDrag(pos));
    this.eventManager.on('canvas:release', (pos) => this.handleCanvasRelease(pos));

    this.eventManager.on('element:select', (element) => this.selectElement(element));
    this.eventManager.on('element:deselect', () => this.deselectElement());
  }

  initTools() {
    this.elementTools = {
      select: this.handleSelectTool ? this.handleSelectTool.bind(this) : null,
      move: this.handleMoveTool ? this.handleMoveTool.bind(this) : null,
      resize: this.handleResizeTool ? this.handleResizeTool.bind(this) : null,
      rotate: this.handleRotateTool ? this.handleRotateTool.bind(this) : null
    };

    // Controleer of alle tools correct zijn ingesteld
    Object.keys(this.elementTools).forEach(tool => {
      if (!this.elementTools[tool]) {
        console.warn(`Tool "${tool}" is niet correct gedefinieerd.`);
      }
    });
  }

  createElement(type, shape, options = {}) {
    const layer = this.layerManager.getActiveLayer();
    if (!layer || layer.locked) return null;

    const element = new TerrainElement(type, shape, {
      ...options,
      layerId: layer.id
    });

    layer.addElement(element);
    this.elementCount++;

    this.eventManager.emit('element:created', {
      element,
      layerId: layer.id
    });

    return element;
  }

  selectElement(element) {
    if (this.selectedElement === element) return;

    this.deselectElement();
    this.selectedElement = element;

    this.eventManager.emit('element:selected', {
      element,
      properties: this.getElementProperties(element)
    });
  }

  deselectElement() {
    if (!this.selectedElement) return;

    const previousElement = this.selectedElement;
    this.selectedElement = null;

    this.eventManager.emit('element:deselected', {
      element: previousElement
    });
  }

  deleteElement(element) {
    const layer = this.layerManager.layers.find(l => l.id === element.layerId);
    if (!layer || layer.locked) return false;

    const deleted = layer.removeElement(element.id);
    if (deleted) {
      this.elementCount--;

      if (this.selectedElement === element) {
        this.deselectElement();
      }

      this.eventManager.emit('element:deleted', {
        elementId: element.id,
        layerId: layer.id
      });
    }

    return !!deleted;
  }

  getElementProperties(element) {
    const baseProps = {
      id: element.id,
      type: element.type,
      name: element.name,
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height,
      rotation: element.rotation,
      color: element.color,
      visible: element.visible,
      locked: element.locked
    };

    // Type-specific properties
    switch (element.type) {
      case 'power-point':
        return {
          ...baseProps,
          voltage: element.metadata.voltage || 230,
          wattage: element.metadata.wattage || 0,
          circuit: element.metadata.circuit || 1
        };
      case 'water-pipe':
        return {
          ...baseProps,
          diameter: element.metadata.diameter || 50,
          flowDirection: element.metadata.flowDirection || 'none'
        };
      default:
        return baseProps;
    }
  }

  updateElement(element, properties) {
    // Update basic properties
    Object.keys(properties).forEach(key => {
      if (key in element) {
        element[key] = properties[key];
      } else {
        element.metadata[key] = properties[key];
      }
    });

    this.eventManager.emit('element:updated', {
      element,
      properties
    });
  }

  // Canvas interaction handlers
  handleCanvasClick(pos) {
    if (this.tempElement) {
      this.finalizeTempElement(pos);
      return;
    }

    const element = this.getElementAtPosition(pos);
    if (element) {
      this.selectElement(element);
    } else {
      this.deselectElement();
    }
  }

  handleCanvasDrag(pos) {
    if (this.selectedElement && !this.selectedElement.locked) {
      this.elementTools.move(pos);
    }
  }

  handleCanvasRelease(pos) {
    if (this.selectedElement) {
      this.eventManager.emit('element:modified', {
        element: this.selectedElement
      });
    }
  }

  // Tool handlers
  handleSelectTool(pos) {
    const element = this.getElementAtPosition(pos);
    this.selectElement(element);
  }

  handleMoveTool(pos) {
    if (!this.selectedElement) return;

    const dx = pos.x - this.lastPosition.x;
    const dy = pos.y - this.lastPosition.y;

    this.selectedElement.move(dx, dy);
    this.lastPosition = pos;

    this.eventManager.emit('element:moving', {
      element: this.selectedElement,
      dx,
      dy
    });
  }

  getElementAtPosition(pos) {
    // Check layers in reverse order (top to bottom)
    for (let i = this.layerManager.layers.length - 1; i >= 0; i--) {
      const layer = this.layerManager.layers[i];
      if (!layer.visible) continue;

      // Check elements in reverse order (newest first)
      for (let j = layer.elements.length - 1; j >= 0; j--) {
        const element = layer.elements[j];
        if (!element.visible) continue;

        if (this.isPositionInElement(pos, element)) {
          return element;
        }
      }
    }
    return null;
  }

  isPositionInElement(pos, element) {
    switch (element.shape) {
      case 'rect':
        return pos.x >= element.x &&
          pos.x <= element.x + element.width &&
          pos.y >= element.y &&
          pos.y <= element.y + element.height;
      case 'circle':
        const radius = element.width / 2;
        const dx = pos.x - (element.x + radius);
        const dy = pos.y - (element.y + radius);
        return Math.sqrt(dx * dx + dy * dy) <= radius;
      case 'polygon':
        return this.pointInPolygon(pos, element.points);
      default:
        return false;
    }
  }

  pointInPolygon(point, polygon) {
    // Ray-casting algorithm
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;

      const intersect = ((yi > point.y) !== (yj > point.y)) &&
        (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }
}
class EventManager {
  constructor() {
    this.listeners = new Map();
    this.debugMode = false;
  }

  on(event, callback, options = {}) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    const listener = {
      callback,
      once: options.once || false,
      context: options.context || null
    };

    this.listeners.get(event).push(listener);

    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  once(event, callback) {
    return this.on(event, callback, { once: true });
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;

    const listeners = this.listeners.get(event);
    const index = listeners.findIndex(l => l.callback === callback);

    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }

  emit(event, data = {}) {
    if (this.debugMode) {
      console.log(`[Event] ${event}`, data);
    }

    if (!this.listeners.has(event)) return;

    const listeners = this.listeners.get(event);
    const toRemove = [];

    listeners.forEach((listener, index) => {
      try {
        listener.callback.call(listener.context, data);
        if (listener.once) {
          toRemove.push(index);
        }
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });

    // Remove once listeners in reverse order
    toRemove.reverse().forEach(index => {
      listeners.splice(index, 1);
    });
  }

  destroy() {
    this.listeners.clear();
  }
}
class LayerManager {

  constructor(eventManager) {
    this.eventManager = eventManager;
    this.layers = [];
    this.activeLayerIndex = 0;

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.eventManager.on('layer:add', () => this.addLayer());
    this.eventManager.on('layer:remove', (layerId) => this.removeLayer(layerId));
    this.eventManager.on('layer:select', (layerId) => this.setActiveLayer(layerId));
  }

  addLayer(name = `Layer ${this.layers.length + 1}`, options = {}) {
    const layer = new Layer(`layer-${Date.now()}`, name, options);
    this.layers.push(layer);

    this.eventManager.emit('layer:added', {
      layer,
      index: this.layers.length - 1
    });

    return layer;
  }

  removeLayer(layerId) {
    const index = this.layers.findIndex(layer => layer.id === layerId);
    if (index === -1) return false;

    const [removedLayer] = this.layers.splice(index, 1);

    // Adjust active layer index if needed
    if (this.activeLayerIndex >= index) {
      this.activeLayerIndex = Math.max(0, this.activeLayerIndex - 1);
    }

    this.eventManager.emit('layer:removed', {
      layerId: removedLayer.id,
      index
    });

    return true;
  }

  getActiveLayer() {
    return this.layers[this.activeLayerIndex];
  }

  setActiveLayer(layerId) {
    const index = this.layers.findIndex(layer => layer.id === layerId);
    if (index !== -1) {
      this.activeLayerIndex = index;
      this.eventManager.emit('layer:activated', {
        layer: this.layers[index],
        index
      });
      return true;
    }
    return false;
  }

  moveLayer(layerId, direction) {
    const index = this.layers.findIndex(layer => layer.id === layerId);
    if (index === -1) return false;

    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= this.layers.length) return false;

    // Swap layers
    [this.layers[index], this.layers[newIndex]] =
      [this.layers[newIndex], this.layers[index]];

    // Update active layer index if needed
    if (this.activeLayerIndex === index) {
      this.activeLayerIndex = newIndex;
    } else if (this.activeLayerIndex === newIndex) {
      this.activeLayerIndex = index;
    }

    this.eventManager.emit('layers:reordered', {
      movedLayerId: layerId,
      fromIndex: index,
      toIndex: newIndex
    });

    return true;
  }

  toJSON() {
    return this.layers.map(layer => layer.toJSON());
  }

  loadFromJSON(layersJSON) {
    this.layers = layersJSON.map(layerJson => Layer.fromJSON(layerJson));
    this.activeLayerIndex = Math.min(
      this.activeLayerIndex,
      this.layers.length - 1
    );

    this.eventManager.emit('layers:loaded', {
      count: this.layers.length
    });
  }
}
class ToolManager {
  constructor(eventManager) {
    this.eventManager = eventManager;
    this.currentTool = 'select';
    this.toolState = {}; // Voor tool-specifieke state
    this.tools = {
      select: new SelectTool(eventManager),
      line: new LineTool(eventManager),
      rect: new RectangleTool(eventManager),
      circle: new CircleTool(eventManager),
      polygon: new PolygonTool(eventManager),
      text: new TextTool(eventManager),
      measure: new MeasureTool(eventManager),
      eraser: new EraserTool(eventManager),
      paint: new PaintTool(eventManager)
    };

    this.init();
  }

  init() {
    // Canvas event listeners
    const canvas = document.getElementById('main-canvas');

    canvas.addEventListener('mousedown', (e) => {
      const pos = this.getCanvasCoordinates(e);
      this.tools[this.currentTool].handleStart(pos.x, pos.y, e);
      this.eventManager.emit('tool:start', { tool: this.currentTool, x: pos.x, y: pos.y });
    });

    canvas.addEventListener('mousemove', (e) => {
      const pos = this.getCanvasCoordinates(e);
      this.tools[this.currentTool].handleMove(pos.x, pos.y, e);
      this.eventManager.emit('tool:move', { tool: this.currentTool, x: pos.x, y: pos.y });
    });

    canvas.addEventListener('mouseup', (e) => {
      const pos = this.getCanvasCoordinates(e);
      this.tools[this.currentTool].handleEnd(pos.x, pos.y, e);
      this.eventManager.emit('tool:end', { tool: this.currentTool, x: pos.x, y: pos.y });
    });

    canvas.addEventListener('dblclick', (e) => {
      const pos = this.getCanvasCoordinates(e);
      this.tools[this.currentTool].handleDoubleClick(pos.x, pos.y, e);
    });

    // Touch support
    canvas.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      const pos = this.getCanvasCoordinates(touch);
      this.tools[this.currentTool].handleStart(pos.x, pos.y, e);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      this.tools[this.currentTool].handleKeyDown(e);

      // Tool switching shortcuts
      if (e.ctrlKey || e.metaKey) return;
      switch (e.key) {
        case 'v': this.setTool('select'); break;
        case 'l': this.setTool('line'); break;
        case 'r': this.setTool('rect'); break;
        case 'c': this.setTool('circle'); break;
        case 'p': this.setTool('polygon'); break;
        case 't': this.setTool('text'); break;
        case 'm': this.setTool('measure'); break;
        case 'e': this.setTool('eraser'); break;
      }
    });
  }

  setTool(toolName) {
    if (this.tools[toolName]) {
      // Clean up previous tool
      if (this.tools[this.currentTool].deactivate) {
        this.tools[this.currentTool].deactivate();
      }

      this.currentTool = toolName;

      // Activate new tool
      if (this.tools[toolName].activate) {
        this.tools[toolName].activate();
      }

      this.eventManager.emit('tool:changed', toolName);
      this.updateCursor();
    }
  }

  getCanvasCoordinates(inputEvent) {
    const canvas = document.getElementById('main-canvas');
    const rect = canvas.getBoundingClientRect();
    const scale = this.eventManager.viewportManager.currentScale;
    const pan = this.eventManager.viewportManager.panOffset;

    return {
      x: (inputEvent.clientX - rect.left - pan.x) / scale,
      y: (inputEvent.clientY - rect.top - pan.y) / scale
    };
  }

  updateCursor() {
    const canvas = document.getElementById('main-canvas');
    canvas.style.cursor = this.tools[this.currentTool].cursor || 'default';
  }

  getCurrentTool() {
    return this.tools[this.currentTool];
  }
}
class PluginManager {
  constructor(eventManager) {
    this.eventManager = eventManager;
    this.plugins = new Map();
  }

  loadPlugin(pluginClass) {
    try {
      const plugin = new pluginClass(this.eventManager);
      this.plugins.set(plugin.name, plugin);
      this.eventManager.emit('plugin:loaded', plugin.name);
      return true;
    } catch (error) {
      this.eventManager.emit('plugin:error', { name: pluginClass.name, error });
      return false;
    }
  }

  unloadPlugin(pluginName) {
    if (this.plugins.has(pluginName)) {
      this.plugins.get(pluginName).cleanup();
      this.plugins.delete(pluginName);
      this.eventManager.emit('plugin:unloaded', pluginName);
      return true;
    }
    return false;
  }

  getPlugin(pluginName) {
    return this.plugins.get(pluginName);
  }

  listPlugins() {
    return Array.from(this.plugins.keys());
  }
}
class ViewportManager {
  constructor(eventManager) {
    this.eventManager = eventManager;
    this.canvas = document.getElementById('svg-canvas');
    this.tempCanvas = document.getElementById('temp-canvas');
    this.ctx = this.tempCanvas.getContext('2d');
    this.scale = 1.0;
    this.panOffset = { x: 0, y: 0 };
    this.lastPanPosition = { x: 0, y: 0 };
    this.isPanning = false;
    this.gridSize = 40;
    this.showGrid = true;

    this.initCanvas();
    this.setupEventListeners();
  }

  initCanvas() {
    // Set canvas dimensions
    const width = 1883.42;
    const height = 1003.49;
    
    this.canvas.setAttribute('width', width);
    this.canvas.setAttribute('height', height);
    this.tempCanvas.width = width;
    this.tempCanvas.height = height;
    
    // Initial styles
    this.canvas.style.transformOrigin = '0 0';
    this.updateCanvasTransform();
  }

  setupEventListeners() {
    // Mouse events
    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    
    // Touch events
    this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
    document.addEventListener('touchmove', (e) => this.handleTouchMove(e));
    document.addEventListener('touchend', (e) => this.handleTouchEnd(e));
    
    // Zoom
    this.canvas.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
    
    // Keyboard events
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    
    // Internal events
    this.eventManager.on('viewport:zoom', (params) => this.zoom(params));
    this.eventManager.on('viewport:pan', (params) => this.pan(params));
    this.eventManager.on('viewport:reset', () => this.resetView());
    this.eventManager.on('grid:toggle', (show) => this.toggleGrid(show));
  }

  // Transform methods
  updateCanvasTransform() {
    const transform = `scale(${this.scale}) translate(${this.panOffset.x}px, ${this.panOffset.y}px)`;
    this.canvas.style.transform = transform;
    this.tempCanvas.style.transform = transform;
  }

  screenToCanvas(pos) {
    return {
      x: (pos.x - this.panOffset.x) / this.scale,
      y: (pos.y - this.panOffset.y) / this.scale
    };
  }

  canvasToScreen(pos) {
    return {
      x: pos.x * this.scale + this.panOffset.x,
      y: pos.y * this.scale + this.panOffset.y
    };
  }

  // View manipulation
  zoom({ factor, center }) {
    const oldScale = this.scale;
    this.scale *= factor;
    
    // Limit zoom range
    this.scale = Math.max(0.1, Math.min(10, this.scale));
    
    if (center) {
      // Adjust pan offset to zoom toward mouse position
      this.panOffset.x = center.x - (center.x - this.panOffset.x) * (this.scale / oldScale);
      this.panOffset.y = center.y - (center.y - this.panOffset.y) * (this.scale / oldScale);
    }
    
    this.updateCanvasTransform();
    this.eventManager.emit('viewport:changed', {
      scale: this.scale,
      panOffset: this.panOffset
    });
  }

  pan({ dx, dy }) {
    this.panOffset.x += dx;
    this.panOffset.y += dy;
    this.updateCanvasTransform();
    
    this.eventManager.emit('viewport:changed', {
      scale: this.scale,
      panOffset: this.panOffset
    });
  }

  resetView() {
    this.scale = 1.0;
    this.panOffset = { x: 0, y: 0 };
    this.updateCanvasTransform();
    
    this.eventManager.emit('viewport:changed', {
      scale: this.scale,
      panOffset: this.panOffset
    });
  }

  fitToContent() {
    // Calculate bounding box of all elements
    // Then adjust scale and pan to fit
    // Implementation depends on your content
  }

  // Grid methods
  toggleGrid(show) {
    this.showGrid = show !== undefined ? show : !this.showGrid;
    this.drawGrid();
  }

  drawGrid() {
    // Clear temp canvas
    this.ctx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
    
    if (!this.showGrid) return;
    
    const scaledGridSize = this.gridSize * this.scale;
    const offsetX = this.panOffset.x % scaledGridSize;
    const offsetY = this.panOffset.y % scaledGridSize;
    
    this.ctx.strokeStyle = '#e0e0e0';
    this.ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = offsetX; x < this.tempCanvas.width; x += scaledGridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.tempCanvas.height);
      this.ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = offsetY; y < this.tempCanvas.height; y += scaledGridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.tempCanvas.width, y);
      this.ctx.stroke();
    }
    
    // Main axes
    this.ctx.strokeStyle = '#888';
    this.ctx.lineWidth = 2;
    
    // X axis
    const originY = -this.panOffset.y / this.scale;
    if (originY >= 0 && originY < this.tempCanvas.height) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, originY);
      this.ctx.lineTo(this.tempCanvas.width, originY);
      this.ctx.stroke();
    }
    
    // Y axis
    const originX = -this.panOffset.x / this.scale;
    if (originX >= 0 && originX < this.tempCanvas.width) {
      this.ctx.beginPath();
      this.ctx.moveTo(originX, 0);
      this.ctx.lineTo(originX, this.tempCanvas.height);
      this.ctx.stroke();
    }
  }

  // Event handlers
  handleMouseDown(e) {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) { // Middle mouse or Ctrl+Left
      this.isPanning = true;
      this.lastPanPosition = { x: e.clientX, y: e.clientY };
      this.canvas.style.cursor = 'grabbing';
      e.preventDefault();
      return;
    }
    
    const canvasPos = this.screenToCanvas({ x: e.clientX, y: e.clientY });
    this.eventManager.emit('canvas:click', canvasPos);
  }

  handleMouseMove(e) {
    if (this.isPanning) {
      const dx = e.clientX - this.lastPanPosition.x;
      const dy = e.clientY - this.lastPanPosition.y;
      
      this.pan({ dx, dy });
      this.lastPanPosition = { x: e.clientX, y: e.clientY };
      e.preventDefault();
      return;
    }
    
    const canvasPos = this.screenToCanvas({ x: e.clientX, y: e.clientY });
    this.eventManager.emit('canvas:drag', canvasPos);
  }

  handleMouseUp(e) {
    if (this.isPanning) {
      this.isPanning = false;
      this.canvas.style.cursor = 'default';
      e.preventDefault();
      return;
    }
    
    const canvasPos = this.screenToCanvas({ x: e.clientX, y: e.clientY });
    this.eventManager.emit('canvas:release', canvasPos);
  }

  // Similar touch handlers would be implemented...
  handleTouchStart(e) { /* ... */ }
  handleTouchMove(e) { /* ... */ }
  handleTouchEnd(e) { /* ... */ }

  handleWheel(e) {
    if (e.ctrlKey) {
      // Zoom
      const rect = this.canvas.getBoundingClientRect();
      const center = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      this.zoom({ factor, center });
      e.preventDefault();
    } else {
      // Pan vertically
      this.pan({ dx: 0, dy: -e.deltaY });
    }
  }

  handleKeyDown(e) {
    // Pan with arrow keys
    if (e.key.startsWith('Arrow')) {
      const step = 20;
      let dx = 0, dy = 0;
      
      switch (e.key) {
        case 'ArrowUp': dy = -step; break;
        case 'ArrowDown': dy = step; break;
        case 'ArrowLeft': dx = -step; break;
        case 'ArrowRight': dx = step; break;
      }
      
      this.pan({ dx, dy });
      e.preventDefault();
    }
  }
}
class TerrainElement {
  static nextId = 1;

  constructor(type, shape, options = {}) {
    this.id = `element-${TerrainElement.nextId++}`;
    this.type = type;
    this.shape = shape;
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.width = options.width || 0;
    this.height = options.height || 0;
    this.rotation = options.rotation || 0;
    this.color = options.color || this.getDefaultColor(type);
    this.name = options.name || '';
    this.visible = options.visible !== false;
    this.locked = options.locked || false;
    this.layerId = options.layerId || null;
    this.metadata = options.metadata || {};
    this.points = options.points || this.getDefaultPoints();
  }

  getDefaultPoints() {
    switch (this.shape) {
      case 'rect':
        return [
          { x: this.x, y: this.y, id: 'p1' },
          { x: this.x + this.width, y: this.y, id: 'p2' },
          { x: this.x + this.width, y: this.y + this.height, id: 'p3' },
          { x: this.x, y: this.y + this.height, id: 'p4' }
        ];
      case 'circle':
        return [
          { x: this.x, y: this.y, id: 'center' }
        ];
      case 'line':
        return [
          { x: this.x, y: this.y, id: 'start' },
          { x: this.x + this.width, y: this.y + this.height, id: 'end' }
        ];
      default:
        return [];
    }
  }

  getDefaultColor(type) {
    const colors = {
      'power-point': '#FF0000',
      'water-pipe': '#0000FF',
      'text': '#000000',
      'default': '#888888'
    };
    return colors[type] || colors.default;
  }

  move(dx, dy) {
    if (this.locked) return false;

    this.x += dx;
    this.y += dy;

    // Update all points if they exist
    if (this.points) {
      this.points.forEach(point => {
        point.x += dx;
        point.y += dy;
      });
    }

    return true;
  }

  resize(newWidth, newHeight, anchor = 'top-left') {
    if (this.locked) return false;

    // Implement different anchor points
    switch (anchor) {
      case 'top-left':
        this.width = newWidth;
        this.height = newHeight;
        break;
      case 'center':
        const dx = (newWidth - this.width) / 2;
        const dy = (newHeight - this.height) / 2;
        this.x -= dx;
        this.y -= dy;
        this.width = newWidth;
        this.height = newHeight;
        break;
      case 'top-right':
        this.x -= (newWidth - this.width);
        this.width = newWidth;
        this.height = newHeight;
        break;
      case 'bottom-left':
        this.y -= (newHeight - this.height);
        this.width = newWidth;
        this.height = newHeight;
        break;
      case 'bottom-right':
        this.x -= (newWidth - this.width);
        this.y -= (newHeight - this.height);
        this.width = newWidth;
        this.height = newHeight;
        break;
      default:
        throw new Error(`Unsupported anchor point: ${anchor}`);
    }

    return true;
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      shape: this.shape,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      rotation: this.rotation,
      color: this.color,
      name: this.name,
      visible: this.visible,
      locked: this.locked,
      layerId: this.layerId,
      points: this.points,
      metadata: this.metadata
    };
  }

  static fromJSON(json) {
    return new TerrainElement(json.type, json.shape, {
      id: json.id,
      x: json.x,
      y: json.y,
      width: json.width,
      height: json.height,
      rotation: json.rotation,
      color: json.color,
      name: json.name,
      visible: json.visible,
      locked: json.locked,
      layerId: json.layerId,
      points: json.points,
      metadata: json.metadata
    });
  }
}
class Layer {
  constructor(id, name, options = {}) {
    this.id = id;
    this.name = name || `Layer ${id}`;
    this.visible = options.visible !== false;
    this.locked = options.locked || false;
    this.opacity = options.opacity || 1.0;
    this.elements = [];
    this.metadata = options.metadata || {};
  }

  addElement(element) {
    if (!(element instanceof TerrainElement)) {
      throw new Error('Only TerrainElement instances can be added to a layer');
    }

    element.layerId = this.id;
    this.elements.push(element);
    return element;
  }

  removeElement(elementId) {
    const index = this.elements.findIndex(el => el.id === elementId);
    if (index !== -1) {
      return this.elements.splice(index, 1)[0];
    }
    return null;
  }

  getElement(elementId) {
    return this.elements.find(el => el.id === elementId);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      visible: this.visible,
      locked: this.locked,
      opacity: this.opacity,
      elements: this.elements.map(el => el.toJSON()),
      metadata: this.metadata
    };
  }

  static fromJSON(json) {
    const layer = new Layer(json.id, json.name, {
      visible: json.visible,
      locked: json.locked,
      opacity: json.opacity,
      metadata: json.metadata
    });

    json.elements.forEach(elJson => {
      layer.addElement(TerrainElement.fromJSON(elJson));
    });

    return layer;
  }
}
class MenuSystem {
  constructor(eventManager) {
    this.eventManager = eventManager;
    this.contextMenus = new Map();
    this.initMainMenu();
    this.initContextMenus();
    this.setupKeyboardShortcuts();
  }

  initMainMenu() {
    this.menuStructure = {
      file: {
        label: 'File',
        items: {
          new: { label: 'New Project', shortcut: 'Ctrl+N', action: 'project:new' },
          open: { label: 'Open...', shortcut: 'Ctrl+O', action: 'project:open' },
          save: { label: 'Save', shortcut: 'Ctrl+S', action: 'project:save' },
          saveAs: { label: 'Save As...', shortcut: 'Ctrl+Shift+S', action: 'project:save-as' },
          export: {
            label: 'Export',
            submenu: {
              png: { label: 'As PNG', action: 'export:png' },
              svg: { label: 'As SVG', action: 'export:svg' },
              pdf: { label: 'As PDF', action: 'export:pdf' }
            }
          },
          exit: { label: 'Exit', action: 'app:exit' }
        }
      },
      edit: {
        label: 'Edit',
        items: {
          undo: { label: 'Undo', shortcut: 'Ctrl+Z', action: 'edit:undo', disabled: true },
          redo: { label: 'Redo', shortcut: 'Ctrl+Y', action: 'edit:redo', disabled: true },
          separator1: { type: 'separator' },
          cut: { label: 'Cut', shortcut: 'Ctrl+X', action: 'edit:cut' },
          copy: { label: 'Copy', shortcut: 'Ctrl+C', action: 'edit:copy' },
          paste: { label: 'Paste', shortcut: 'Ctrl+V', action: 'edit:paste' },
          delete: { label: 'Delete', shortcut: 'Del', action: 'edit:delete' }
        }
      },
      view: {
        label: 'View',
        items: {
          zoomIn: { label: 'Zoom In', shortcut: 'Ctrl+=', action: 'view:zoom-in' },
          zoomOut: { label: 'Zoom Out', shortcut: 'Ctrl+-', action: 'view:zoom-out' },
          zoomReset: { label: 'Reset Zoom', shortcut: 'Ctrl+0', action: 'view:zoom-reset' },
          separator1: { type: 'separator' },
          grid: { label: 'Show Grid', type: 'checkbox', checked: true, action: 'view:toggle-grid' },
          rulers: { label: 'Show Rulers', type: 'checkbox', checked: true, action: 'view:toggle-rulers' }
        }
      },
      tools: {
        label: 'Tools',
        items: {
          select: { label: 'Select Tool', shortcut: 'V', action: 'tool:select' },
          line: { label: 'Line Tool', shortcut: 'L', action: 'tool:line' },
          rectangle: { label: 'Rectangle Tool', shortcut: 'R', action: 'tool:rect' },
          circle: { label: 'Circle Tool', shortcut: 'C', action: 'tool:circle' },
          text: { label: 'Text Tool', shortcut: 'T', action: 'tool:text' },
          measure: { label: 'Measure Tool', shortcut: 'M', action: 'tool:measure' }
        }
      },
      plugins: {
        label: 'Plugins',
        items: {}
      }
    };

    this.buildMenu();
    this.setupEventListeners();
  }

  buildMenu() {
    const menuContainer = document.getElementById('menu-bar');
    menuContainer.innerHTML = '';

    Object.entries(this.menuStructure).forEach(([key, menuData]) => {
      const menuItem = document.createElement('div');
      menuItem.className = 'menu-item';
      menuItem.textContent = menuData.label;

      const submenu = document.createElement('div');
      submenu.className = 'submenu';

      Object.entries(menuData.items).forEach(([itemKey, itemData]) => {
        if (itemData.type === 'separator') {
          submenu.appendChild(document.createElement('hr'));
        } else {
          const item = document.createElement('div');
          item.className = 'menu-option';
          item.dataset.action = itemData.action;

          const label = document.createElement('span');
          label.textContent = itemData.label;
          item.appendChild(label);

          if (itemData.shortcut) {
            const shortcut = document.createElement('span');
            shortcut.className = 'shortcut';
            shortcut.textContent = itemData.shortcut;
            item.appendChild(shortcut);
          }

          if (itemData.type === 'checkbox') {
            item.classList.add('checkbox');
            if (itemData.checked) item.classList.add('checked');
          }

          submenu.appendChild(item);
        }
      });

      menuItem.appendChild(submenu);
      menuContainer.appendChild(menuItem);
    });
  }

  initContextMenus() {
    this.registerContextMenu('canvas', [
      { label: 'Paste', action: 'edit:paste' },
      { type: 'separator' },
      { label: 'Select All', action: 'edit:select-all' },
      { label: 'Deselect', action: 'edit:deselect' },
      { type: 'separator' },
      { label: 'View Settings...', action: 'view:settings' }
    ]);

    this.registerContextMenu('element', [
      { label: 'Cut', action: 'edit:cut' },
      { label: 'Copy', action: 'edit:copy' },
      { label: 'Delete', action: 'edit:delete' },
      { type: 'separator' },
      { label: 'Bring to Front', action: 'element:bring-to-front' },
      { label: 'Send to Back', action: 'element:send-to-back' },
      { type: 'separator' },
      { label: 'Properties...', action: 'element:properties' }
    ]);
  }

  registerContextMenu(context, items) {
    this.contextMenus.set(context, items);
  }

  showContextMenu(context, x, y) {
    const menuItems = this.contextMenus.get(context);
    if (!menuItems) return;

    const contextMenu = document.getElementById('context-menu');
    contextMenu.innerHTML = '';
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;

    menuItems.forEach(item => {
      if (item.type === 'separator') {
        contextMenu.appendChild(document.createElement('hr'));
      } else {
        const menuItem = document.createElement('div');
        menuItem.className = 'context-menu-item';
        menuItem.textContent = item.label;
        menuItem.dataset.action = item.action;
        contextMenu.appendChild(menuItem);
      }
    });

    const hideMenu = () => {
      contextMenu.style.display = 'none';
      document.removeEventListener('click', hideMenu);
    };

    document.addEventListener('click', hideMenu);
  }

  setupEventListeners() {
    document.querySelectorAll('.menu-option, .context-menu-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        this.eventManager.emit(item.dataset.action);
      });
    });

    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const target = e.target.closest('[data-context]');
      if (target) {
        this.showContextMenu(target.dataset.context, e.pageX, e.pageY);
      }
    });
  }

  setupKeyboardShortcuts() {
    const shortcuts = new Map();

    const flattenShortcuts = (items) => {
      Object.values(items).forEach(item => {
        if (item.submenu) flattenShortcuts(item.submenu);
        if (item.shortcut) shortcuts.set(item.shortcut, item.action);
      });
    };

    flattenShortcuts(Object.values(this.menuStructure).map(m => m.items));

    document.addEventListener('keydown', (e) => {
      const key = `${e.ctrlKey || e.metaKey ? 'Ctrl+' : ''}${e.shiftKey ? 'Shift+' : ''}${e.key.toUpperCase()}`;
      if (shortcuts.has(key)) {
        e.preventDefault();
        this.eventManager.emit(shortcuts.get(key));
      }
    });
  }

  updateMenuState() {
    document.querySelectorAll('[data-action="edit:undo"]').forEach(item => {
      item.classList.toggle('disabled', !this.eventManager.projectManager.canUndo());
    });
    document.querySelectorAll('[data-action="edit:redo"]').forEach(item => {
      item.classList.toggle('disabled', !this.eventManager.projectManager.canRedo());
    });
  }

  addPluginMenuItem(pluginName, menuItems) {
    if (!this.menuStructure.plugins.items[pluginName]) {
      this.menuStructure.plugins.items[pluginName] = {
        label: pluginName,
        submenu: {}
      };
    }

    Object.assign(this.menuStructure.plugins.items[pluginName].submenu, menuItems);
    this.buildMenu();
  }
}
class ThemeSwitcher {
  constructor(container = document.body) {
    this.container = container
    this.themeOptions = [
      { name: 'default', icon: '🌙', label: 'Dark' },
      { name: 'light', icon: '🌞', label: 'Light' },
      { name: 'highcontrast', icon: '⚡', label: 'Contrast' }
    ]
    this.render()
    this.init()
    this.addMobileDropdown()
  }

  render() {
    this.wrapper = document.createElement('div')
    this.wrapper.classList.add('theme-switcher')
    this.themeOptions.forEach(({ name, icon }) => {
      const btn = document.createElement('button')
      btn.dataset.theme = name
      btn.textContent = icon
      if (ThemeManager.current === name) btn.classList.add('active')
      btn.addEventListener('click', () => this.setTheme(name))
      this.wrapper.appendChild(btn)
    })
    this.container.appendChild(this.wrapper)
  }

  setTheme(themeName) {
    const html = document.documentElement
    html.classList.add('theme-fade')
    setTimeout(() => {
      ThemeManager.set(themeName)
      const buttons = this.wrapper.querySelectorAll('button')
      buttons.forEach(b => b.classList.remove('active'))
      const active = this.wrapper.querySelector(`[data-theme="${themeName}"]`)
      if (active) active.classList.add('active')
      if (this.select) this.select.value = themeName
      html.classList.remove('theme-fade')
    }, 150)
  }

  init() {
    const saved = localStorage.getItem('ui-theme') || ThemeManager.current
    this.setTheme(saved)
  }

  addMobileDropdown() {
    const select = document.createElement('select')
    select.classList.add('theme-switcher-select')
    this.themeOptions.forEach(({ name, label }) => {
      const opt = document.createElement('option')
      opt.value = name
      opt.textContent = label
      select.appendChild(opt)
    })
    select.value = ThemeManager.current
    select.addEventListener('change', e => this.setTheme(e.target.value))
    this.container.appendChild(select)
    this.select = select

    const mediaQuery = window.matchMedia('(max-width: 600px)')
    const toggleVisibility = () => {
      this.wrapper.style.display = mediaQuery.matches ? 'none' : 'flex'
      select.style.display = mediaQuery.matches ? 'block' : 'none'
    }
    toggleVisibility()
    mediaQuery.addEventListener('change', toggleVisibility)
  }

  resetTheme() {
    localStorage.removeItem('ui-theme')
    this.setTheme('default')
  }
}
class Tool {
  constructor(eventManager) {
    this.eventManager = eventManager;
    this.cursor = 'default';
    this.isActive = false;
    this.tempElement = null;
  }

  // Lifecycle methods
  activate() {
    this.isActive = true;
  }

  // Lifecycle methods
  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
    this.cleanup();
  }

  // Event handlers
  handleStart(x, y, event) {
    this.startX = x;
    this.startY = y;
    this.lastX = x;
    this.lastY = y;
  }

  handleMove(x, y, event) {
    this.lastX = x;
    this.lastY = y;
  }

  handleEnd(x, y, event) {
    this.cleanup();
  }

  handleDoubleClick(x, y, event) { }
  handleKeyDown(event) { }

  // Utility methods
  cleanup() {
    if (this.tempElement) {
      this.eventManager.emit('element:remove-temp', this.tempElement.id);
      this.tempElement = null;
    }
  }

  createElement(type, shape, startX, startY, endX, endY, options = {}) {
    const element = new TerrainElement(
      type,
      shape,
      Math.min(startX, endX),
      Math.min(startY, endY),
      {
        width: Math.abs(endX - startX),
        height: Math.abs(endY - startY),
        ...options
      }
    );

    this.eventManager.emit('element:create', element);
    return element;
  }

  snapToGrid(x, y) {
    const gridSize = this.eventManager.projectManager.currentProject.gridSize || 10;
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize
    };
  }
}

// App Tools
// ---------------------------------
class SelectTool extends Tool {
  constructor(eventManager) {
    super(eventManager);
    this.cursor = 'pointer';
    this.selectionBox = null;
  }

  handleStart(x, y, event) {
    super.handleStart(x, y, event);

    if (event.shiftKey) {
      // Multi-select mode
      this.selectionBox = { x1: x, y1: y, x2: x, y2: y };
      this.eventManager.emit('selection:start-box', this.selectionBox);
    } else {
      // Single select
      const element = this.eventManager.elementManager.getElementAt(x, y);
      if (element) {
        this.eventManager.emit('element:select', element);
      } else {
        this.eventManager.emit('element:deselect-all');
      }
    }
  }

  handleMove(x, y, event) {
    super.handleMove(x, y, event);

    if (this.selectionBox && event.buttons === 1) {
      this.selectionBox.x2 = x;
      this.selectionBox.y2 = y;
      this.eventManager.emit('selection:update-box', this.selectionBox);
    }
  }

  handleEnd(x, y, event) {
    if (this.selectionBox) {
      const elements = this.eventManager.elementManager.getElementsInArea(
        this.selectionBox.x1, this.selectionBox.y1,
        this.selectionBox.x2, this.selectionBox.y2
      );
      this.eventManager.emit('elements:select-multiple', elements);
      this.selectionBox = null;
      this.eventManager.emit('selection:end-box');
    }
    super.handleEnd(x, y, event);
  }

  cleanup() {
    super.cleanup();
    this.selectionBox = null;
  }
}
class LineTool extends Tool {
  constructor(eventManager) {
    super(eventManager);
    this.cursor = 'crosshair';
  }

  handleStart(x, y, event) {
    super.handleStart(x, y, event);
    const snapped = this.snapToGrid(x, y);

    this.tempElement = this.createElement(
      'line',
      'path',
      snapped.x, snapped.y,
      snapped.x, snapped.y,
      {
        stroke: '#000000',
        strokeWidth: 2,
        isTemp: true
      }
    );
  }

  handleMove(x, y, event) {
    super.handleMove(x, y, event);

    if (this.tempElement && event.buttons === 1) {
      const snapped = this.snapToGrid(x, y);
      const start = this.snapToGrid(this.startX, this.startY);

      // Update temp element
      this.tempElement.width = Math.abs(snapped.x - start.x);
      this.tempElement.height = Math.abs(snapped.y - start.y);
      this.tempElement.pathData = this.createPathData(start.x, start.y, snapped.x, snapped.y);

      this.eventManager.emit('element:update-temp', this.tempElement);
    }
  }

  handleEnd(x, y, event) {
    if (this.tempElement) {
      const snapped = this.snapToGrid(x, y);
      const start = this.snapToGrid(this.startX, this.startY);

      if (Math.abs(snapped.x - start.x) > 5 || Math.abs(snapped.y - start.y) > 5) {
        // Create real element
        const element = this.createElement(
          'line',
          'path',
          start.x, start.y,
          snapped.x, snapped.y,
          {
            stroke: '#000000',
            strokeWidth: 2,
            pathData: this.createPathData(start.x, start.y, snapped.x, snapped.y)
          }
        );
        this.eventManager.emit('element:add-to-layer', element);
      }
    }
    super.handleEnd(x, y, event);
  }

  createPathData(x1, y1, x2, y2) {
    return `M${x1},${y1} L${x2},${y2}`;
  }
}
class RectangleTool extends Tool {
  constructor(eventManager) {
    super(eventManager);
    this.cursor = 'crosshair';
  }

  handleStart(x, y, event) {
    super.handleStart(x, y, event);
    const snapped = this.snapToGrid(x, y);

    this.tempElement = this.createElement(
      'rectangle',
      'rect',
      snapped.x, snapped.y,
      snapped.x, snapped.y,
      {
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 1,
        isTemp: true
      }
    );
  }

  handleMove(x, y, event) {
    super.handleMove(x, y, event);

    if (this.tempElement && event.buttons === 1) {
      const snapped = this.snapToGrid(x, y);
      const start = this.snapToGrid(this.startX, this.startY);

      // Update temp element
      this.tempElement.x = Math.min(start.x, snapped.x);
      this.tempElement.y = Math.min(start.y, snapped.y);
      this.tempElement.width = Math.abs(snapped.x - start.x);
      this.tempElement.height = Math.abs(snapped.y - start.y);

      this.eventManager.emit('element:update-temp', this.tempElement);
    }
  }

  handleEnd(x, y, event) {
    if (this.tempElement) {
      const snapped = this.snapToGrid(x, y);
      const start = this.snapToGrid(this.startX, this.startY);

      if (Math.abs(snapped.x - start.x) > 5 && Math.abs(snapped.y - start.y) > 5) {
        // Create real element
        const element = this.createElement(
          'rectangle',
          'rect',
          Math.min(start.x, snapped.x),
          Math.min(start.y, snapped.y),
          Math.abs(snapped.x - start.x),
          Math.abs(snapped.y - start.y),
          {
            fill: '#ffffff',
            stroke: '#000000',
            strokeWidth: 1
          }
        );
        this.eventManager.emit('element:add-to-layer', element);
      }
    }
    super.handleEnd(x, y, event);
  }
}
class CircleTool extends Tool {
  constructor(eventManager) {
    super(eventManager);
    this.cursor = 'crosshair';
  }

  handleStart(x, y, event) {
    super.handleStart(x, y, event);
    const snapped = this.snapToGrid(x, y);

    this.tempElement = this.createElement(
      'circle',
      'ellipse',
      snapped.x, snapped.y,
      snapped.x, snapped.y,
      {
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 1,
        isTemp: true
      }
    );
  }

  handleMove(x, y, event) {
    super.handleMove(x, y, event);

    if (this.tempElement && event.buttons === 1) {
      const snapped = this.snapToGrid(x, y);
      const radius = Math.sqrt(
        Math.pow(snapped.x - this.startX, 2) +
        Math.pow(snapped.y - this.startY, 2)
      );

      // Update temp element
      this.tempElement.width = radius * 2;
      this.tempElement.height = radius * 2;
      this.tempElement.x = this.startX - radius;
      this.tempElement.y = this.startY - radius;

      this.eventManager.emit('element:update-temp', this.tempElement);
    }
  }

  handleEnd(x, y, event) {
    if (this.tempElement) {
      const snapped = this.snapToGrid(x, y);
      const radius = Math.sqrt(
        Math.pow(snapped.x - this.startX, 2) +
        Math.pow(snapped.y - this.startY, 2)
      );

      if (radius > 5) {
        // Create real element
        const element = this.createElement(
          'circle',
          'ellipse',
          this.startX - radius,
          this.startY - radius,
          radius * 2,
          radius * 2,
          {
            fill: '#ffffff',
            stroke: '#000000',
            strokeWidth: 1
          }
        );
        this.eventManager.emit('element:add-to-layer', element);
      }
    }
    super.handleEnd(x, y, event);
  }
}
class PolygonTool extends Tool {
  constructor(eventManager) {
    super(eventManager);
    this.cursor = 'crosshair';
    this.points = [];
    this.isCreating = false;
  }

  handleStart(x, y, event) {
    super.handleStart(x, y, event);
    const snapped = this.snapToGrid(x, y);

    if (!this.isCreating) {
      // Start new polygon
      this.isCreating = true;
      this.points = [{ x: snapped.x, y: snapped.y }];

      this.tempElement = this.createElement(
        'polygon',
        'path',
        snapped.x, snapped.y,
        snapped.x, snapped.y,
        {
          fill: '#ffffff',
          stroke: '#000000',
          strokeWidth: 1,
          isTemp: true,
          points: this.points
        }
      );
    } else {
      // Add point to existing polygon
      this.points.push({ x: snapped.x, y: snapped.y });
      this.updatePolygonPath();
    }
  }

  handleDoubleClick(x, y, event) {
    if (this.isCreating && this.points.length >= 3) {
      // Finish polygon
      const element = this.createElement(
        'polygon',
        'path',
        0, 0, // Actual position calculated from points
        0, 0,
        {
          fill: '#ffffff',
          stroke: '#000000',
          strokeWidth: 1,
          points: this.points,
          pathData: this.createPathData()
        }
      );

      // Calculate bounding box
      const bbox = this.calculateBoundingBox();
      element.x = bbox.x;
      element.y = bbox.y;
      element.width = bbox.width;
      element.height = bbox.height;

      this.eventManager.emit('element:add-to-layer', element);

      // Reset tool
      this.cleanup();
    }
  }

  handleMove(x, y, event) {
    super.handleMove(x, y, event);

    if (this.isCreating && this.points.length > 0) {
      const snapped = this.snapToGrid(x, y);
      this.tempPoints = [...this.points, { x: snapped.x, y: snapped.y }];
      this.updatePolygonPath();
    }
  }

  updatePolygonPath() {
    if (this.tempElement && this.tempPoints) {
      this.tempElement.pathData = this.createPathData(this.tempPoints);
      this.eventManager.emit('element:update-temp', this.tempElement);
    }
  }

  createPathData(points = this.points) {
    if (points.length === 0) return '';
    return `M${points[0].x},${points[0].y} ` +
      points.slice(1).map(p => `L${p.x},${p.y}`).join(' ') +
      (points.length > 2 ? ' Z' : '');
  }

  calculateBoundingBox() {
    if (this.points.length === 0) return { x: 0, y: 0, width: 0, height: 0 };

    const xs = this.points.map(p => p.x);
    const ys = this.points.map(p => p.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  cleanup() {
    super.cleanup();
    this.points = [];
    this.isCreating = false;
    this.tempPoints = null;
  }

  handleKeyDown(event) {
    if (event.key === 'Escape' && this.isCreating) {
      this.cleanup();
      this.eventManager.emit('tool:cancel-current');
    }
  }
}
class TextTool extends Tool {
  constructor(eventManager) {
    super(eventManager);
    this.cursor = 'text';
  }

  handleStart(x, y, event) {
    super.handleStart(x, y, event);

    // Create text input element at position
    this.textInput = document.createElement('div');
    this.textInput.contentEditable = true;
    this.textInput.style.position = 'absolute';
    this.textInput.style.left = `${x}px`;
    this.textInput.style.top = `${y}px`;
    this.textInput.style.minWidth = '100px';
    this.textInput.style.border = '1px dashed #000';
    this.textInput.style.padding = '2px';
    this.textInput.style.outline = 'none';
    this.textInput.style.backgroundColor = 'white';

    document.getElementById('canvas-container').appendChild(this.textInput);
    this.textInput.focus();

    this.textInput.addEventListener('blur', () => this.finalizeText());
    this.textInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.finalizeText();
      } else if (e.key === 'Escape') {
        this.cancelText();
      }
    });
  }

  finalizeText() {
    if (this.textInput && this.textInput.textContent.trim()) {
      const rect = this.textInput.getBoundingClientRect();
      const canvasRect = document.getElementById('main-canvas').getBoundingClientRect();

      const element = new TerrainElement(
        'text',
        'text',
        rect.left - canvasRect.left,
        rect.top - canvasRect.top,
        {
          width: rect.width,
          height: rect.height,
          text: this.textInput.textContent,
          color: '#000000',
          fontSize: 12,
          fontFamily: 'Arial'
        }
      );

      this.eventManager.emit('element:add-to-layer', element);
    }

    this.cleanup();
  }

  cancelText() {
    this.cleanup();
  }

  cleanup() {
    super.cleanup();
    if (this.textInput) {
      this.textInput.remove();
      this.textInput = null;
    }
  }
}
class MeasureTool extends Tool {
  constructor(eventManager) {
    super(eventManager);
    this.cursor = 'crosshair';
    this.measurements = [];
    this.currentMeasurement = null;
  }

  handleStart(x, y, event) {
    super.handleStart(x, y, event);
    const snapped = this.snapToGrid(x, y);

    if (!this.currentMeasurement) {
      // Start new measurement
      this.currentMeasurement = {
        points: [snapped],
        distances: [],
        totalLength: 0
      };

      this.tempElement = this.createElement(
        'measurement',
        'path',
        snapped.x, snapped.y,
        snapped.x, snapped.y,
        {
          stroke: '#ff0000',
          strokeWidth: 1,
          isTemp: true,
          dashArray: [5, 3],
          showMeasurement: true
        }
      );
    } else {
      // Add point to current measurement
      const lastPoint = this.currentMeasurement.points[this.currentMeasurement.points.length - 1];
      const distance = Math.sqrt(Math.pow(snapped.x - lastPoint.x, 2) + Math.pow(snapped.y - lastPoint.y, 2));

      this.currentMeasurement.points.push(snapped);
      this.currentMeasurement.distances.push(distance);
      this.currentMeasurement.totalLength += distance;

      this.updateMeasurementPath();
    }
  }

  handleDoubleClick(x, y, event) {
    if (this.currentMeasurement && this.currentMeasurement.points.length >= 2) {
      // Finalize measurement
      this.measurements.push(this.currentMeasurement);
      this.eventManager.emit('measurement:add', this.currentMeasurement);
      this.cleanup();
    }
  }

  handleMove(x, y, event) {
    super.handleMove(x, y, event);

    if (this.currentMeasurement && this.currentMeasurement.points.length > 0) {
      const snapped = this.snapToGrid(x, y);
      this.tempPoints = [...this.currentMeasurement.points, snapped];
      this.updateMeasurementPath();
    }
  }

  updateMeasurementPath() {
    if (this.tempElement && this.tempPoints) {
      this.tempElement.pathData = this.createPathData(this.tempPoints);

      // Calculate temporary distance
      if (this.tempPoints.length >= 2) {
        const lastFixed = this.currentMeasurement.points[this.currentMeasurement.points.length - 1];
        const currentTemp = this.tempPoints[this.tempPoints.length - 1];
        const tempDistance = Math.sqrt(
          Math.pow(currentTemp.x - lastFixed.x, 2) +
          Math.pow(currentTemp.y - lastFixed.y, 2)
        );

        this.tempElement.measurementText = `Total: ${this.currentMeasurement.totalLength.toFixed(2)} (+${tempDistance.toFixed(2)})`;
      }

      this.eventManager.emit('element:update-temp', this.tempElement);
    }
  }

  createPathData(points) {
    if (points.length === 0) return '';
    return `M${points[0].x},${points[0].y} ` +
      points.slice(1).map(p => `L${p.x},${p.y}`).join(' ');
  }

  cleanup() {
    super.cleanup();
    this.currentMeasurement = null;
    this.tempPoints = null;
  }

  handleKeyDown(event) {
    if (event.key === 'Escape' && this.currentMeasurement) {
      this.cleanup();
      this.eventManager.emit('tool:cancel-current');
    }
  }
}
class EraserTool extends Tool {
  constructor(eventManager) {
    super(eventManager);
    this.cursor = 'url("eraser-cursor.png") 0 16, auto';
    this.erasing = false;
    this.erasedElements = [];
  }

  handleStart(x, y, event) {
    super.handleStart(x, y, event);
    this.erasing = true;
    this.eraseAt(x, y);
  }

  handleMove(x, y, event) {
    super.handleMove(x, y, event);
    if (this.erasing && event.buttons === 1) {
      this.eraseAt(x, y);
    }
  }

  handleEnd(x, y, event) {
    super.handleEnd(x, y, event);
    this.erasing = false;

    if (this.erasedElements.length > 0) {
      this.eventManager.emit('elements:remove', this.erasedElements);
      this.erasedElements = [];
    }
  }

  eraseAt(x, y) {
    const element = this.eventManager.elementManager.getElementAt(x, y);
    if (element && !this.erasedElements.includes(element)) {
      this.erasedElements.push(element);
      this.eventManager.emit('element:hide-temp', element.id);
    }
  }
}
class PaintTool extends Tool {
  constructor(eventManager) {
    super(eventManager);
    this.cursor = 'url("paint-bucket.png") 0 16, auto';
    this.currentColor = '#000000';
    this.currentFill = '#ffffff';
  }

  handleStart(x, y, event) {
    super.handleStart(x, y, event);
    const element = this.eventManager.elementManager.getElementAt(x, y);

    if (element) {
      const newElement = { ...element };

      if (event.altKey) {
        // Pick color from element
        this.currentColor = element.stroke || this.currentColor;
        this.currentFill = element.fill || this.currentFill;
        this.eventManager.emit('tool:color-changed', {
          stroke: this.currentColor,
          fill: this.currentFill
        });
      } else if (event.shiftKey) {
        // Apply fill
        newElement.fill = this.currentFill;
      } else {
        // Apply stroke
        newElement.stroke = this.currentColor;
      }

      this.eventManager.emit('element:update', {
        id: element.id,
        updates: newElement
      });
    }
  }

  setColor(color, isFill = false) {
    if (isFill) {
      this.currentFill = color;
    } else {
      this.currentColor = color;
    }
  }
}
class PolygonShapeTool extends Tool {
  constructor(eventManager, sides) {
    super(eventManager);
    this.cursor = 'crosshair';
    this.sides = sides;
  }

  handleStart(x, y, event) {
    super.handleStart(x, y, event);
    const snapped = this.snapToGrid(x, y);
    this.tempElement = this.createElement(
      `polygon-${this.sides}`,
      'polygon',
      snapped.x,
      snapped.y,
      snapped.x,
      snapped.y,
      {
        stroke: '#000000',
        strokeWidth: 1,
        fill: '#ffffff',
        isTemp: true
      }
    );
  }

  handleMove(x, y, event) {
    super.handleMove(x, y, event);
    if (this.tempElement && event.buttons === 1) {
      const center = this.snapToGrid(this.startX, this.startY);
      const edge = this.snapToGrid(x, y);
      const radius = Math.sqrt(
        Math.pow(edge.x - center.x, 2) +
        Math.pow(edge.y - center.y, 2)
      );
      const points = [];
      for (let i = 0; i < this.sides; i++) {
        const angle = (2 * Math.PI * i) / this.sides - Math.PI / 2;
        const px = center.x + radius * Math.cos(angle);
        const py = center.y + radius * Math.sin(angle);
        points.push(`${px},${py}`);
      }
      this.tempElement.points = points.join(' ');
      this.tempElement.x = center.x - radius;
      this.tempElement.y = center.y - radius;
      this.tempElement.width = radius * 2;
      this.tempElement.height = radius * 2;
      this.eventManager.emit('element:update-temp', this.tempElement);
    }
  }

  handleEnd(x, y, event) {
    if (this.tempElement && this.tempElement.points) {
      const element = this.createElement(
        `polygon-${this.sides}`,
        'polygon',
        this.tempElement.x,
        this.tempElement.y,
        this.tempElement.width,
        this.tempElement.height,
        {
          points: this.tempElement.points,
          stroke: '#000000',
          strokeWidth: 1,
          fill: '#ffffff'
        }
      );
      this.eventManager.emit('element:add-to-layer', element);
    }
    super.handleEnd(x, y, event);
  }
}
class ExternalSVGTool extends Tool {
  constructor(eventManager, urlProvider) {
    super(eventManager);
    this.cursor = 'crosshair';
    this.urlProvider = urlProvider;
  }

  async handleStart(x, y, event) {
    super.handleStart(x, y, event);
    const snapped = this.snapToGrid(x, y);
    const url = await this.urlProvider();
    if (!url) return;
    fetch(url)
      .then(res => res.text())
      .then(svgText => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgElement = svgDoc.documentElement;
        const wrapper = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        wrapper.innerHTML = svgElement.innerHTML;
        const element = this.createElement(
          'external-svg',
          'g',
          snapped.x,
          snapped.y,
          100,
          100,
          {
            raw: wrapper.innerHTML,
            stroke: 'none',
            fill: 'none'
          }
        );
        this.eventManager.emit('element:add-to-layer', element);
      });
  }
}
class StarTool extends Tool {

  constructor(eventManager, points) {
    super(eventManager);
    this.cursor = 'crosshair';
    this.pointsCount = points;
  }

  handleStart(x, y, event) {
    super.handleStart(x, y, event);
    const snapped = this.snapToGrid(x, y);
    this.tempElement = this.createElement(
      'star',
      'polygon',
      snapped.x,
      snapped.y,
      snapped.x,
      snapped.y,
      {
        stroke: '#000000',
        strokeWidth: 1,
        fill: '#ffffff',
        isTemp: true
      }
    );
  }

  handleMove(x, y, event) {
    super.handleMove(x, y, event);
    if (this.tempElement && event.buttons === 1) {
      const cx = this.startX;
      const cy = this.startY;
      const outerR = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
      const innerR = outerR / 2.5;
      const points = [];
      for (let i = 0; i < this.pointsCount * 2; i++) {
        const angle = (Math.PI / this.pointsCount) * i - Math.PI / 2;
        const r = i % 2 === 0 ? outerR : innerR;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        points.push(`${px},${py}`);
      }
      this.tempElement.points = points.join(' ');
      this.tempElement.x = cx - outerR;
      this.tempElement.y = cy - outerR;
      this.tempElement.width = outerR * 2;
      this.tempElement.height = outerR * 2;
      this.eventManager.emit('element:update-temp', this.tempElement);
    }
  }

  handleEnd(x, y, event) {
    if (this.tempElement && this.tempElement.points) {
      const element = this.createElement(
        'star',
        'polygon',
        this.tempElement.x,
        this.tempElement.y,
        this.tempElement.width,
        this.tempElement.height,
        {
          points: this.tempElement.points,
          stroke: '#000000',
          strokeWidth: 1,
          fill: '#ffffff'
        }
      );
      this.eventManager.emit('element:add-to-layer', element);
    }
    super.handleEnd(x, y, event);
  }

}
class ColorTool {
  constructor(root) {
    this.root = root
    this.mode = 'solid'
    this.color = '#000000'
    this.gradientStops = [{ color: '#000000', position: 0 }, { color: '#ffffff', position: 100 }]
    this.pattern = ''
  }

  setMode(mode) {
    this.mode = mode
  }

  setColor(value) {
    this.color = value
  }

  setGradientStops(stops) {
    this.gradientStops = stops
  }

  setPattern(url) {
    this.pattern = url
  }

  getValue() {
    if (this.mode === 'solid') return this.color
    if (this.mode === 'linear') return `linear-gradient(${this.gradientStops.map(s => `${s.color} ${s.position}%`).join(', ')})`
    if (this.mode === 'radial') return `radial-gradient(${this.gradientStops.map(s => `${s.color} ${s.position}%`).join(', ')})`
    if (this.mode === 'pattern') return `url(${this.pattern})`
    return null
  }
}
class GroupTool {
  constructor() {
    this.groups = []
  }

  group(elements) {
    const group = { id: crypto.randomUUID(), elements: [...elements] }
    this.groups.push(group)
    return group
  }

  ungroup(groupId) {
    const index = this.groups.findIndex(g => g.id === groupId)
    if (index > -1) {
      const elements = this.groups[index].elements
      this.groups.splice(index, 1)
      return elements
    }
    return []
  }
}

// Register Tools
// ---------------------------------
const tools = {
  triangle: (em) => new PolygonShapeTool(em, 3),
  pentagon: (em) => new PolygonShapeTool(em, 5),
  hexagon: (em) => new PolygonShapeTool(em, 6),
  star: (em) => new StarTool(em, 5),
  externalSvg: (em) => new ExternalSVGTool(em, async () => prompt("Voer URL naar SVG-bestand in:")),
  rectangle: (em) => new RectangleTool(em),
  circle: (em) => new CircleTool(em),
  line: (em) => new LineTool(em),
  polygon: (em) => new PolygonTool(em),
  text: (em) => new TextTool(em),
  measure: (em) => new MeasureTool(em),
  select: (em) => new SelectTool(em),
  eraser: (em) => new EraserTool(em),
  paint: (em) => new PaintTool(em),
  color: (em) => new ColorTool(em),
  gradient: (em) => new ColorTool(em),
  pattern: (em) => new ColorTool(em),
  group: (em) => new GroupTool(em),
  ungroup: (em) => new GroupTool(em),
};

// extra's
// ---------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const legendPanel = document.getElementById('legend-panel');
  const closeLegendButton = document.getElementById('close-legend');
  const tabButtons = document.querySelectorAll('.legend-tabs .tab-btn');

  // Event listener for the close button
  closeLegendButton.addEventListener('click', () => {
    legendPanel.classList.remove('active');
  });

  // Event listener for tab buttons
  tabButtons.forEach(tabButton => {
    tabButton.addEventListener('click', () => {
      if (!legendPanel.classList.contains('active')) {
        legendPanel.classList.add('active');
      }
    });
  });

  // Initialize the theme switcher
  ThemeManager.init()
  const themeSwitcher = new ThemeSwitcher(document.querySelector('.toolbar') || document.body)
  const resetBtn = document.querySelector('.reset-theme')
  resetBtn.addEventListener('click', () => themeSwitcher.resetTheme())
});