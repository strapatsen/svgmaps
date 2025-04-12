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
            [e.target.dataset.property]: input.type === 'checkbox' ? e.target.checked : e.target.value
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