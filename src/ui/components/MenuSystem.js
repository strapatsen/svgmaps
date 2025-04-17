// MenuSystem.js
export class MenuSystem {
  /**
   * Creates a new MenuSystem instance
   * @param {Editor} editor - Reference to the main editor instance
   */
  constructor(editor) {
      this.editor = editor;
      this.eventManager = editor.eventManager;
      this.contextMenus = new Map();
      this.keyboardShortcuts = new Map();
      this.pluginMenus = new Map();

      this._initWithExistingHtml();
      this._setupEventListeners();
      this._initDomReferences();
      this._initMainMenu();
      this._initContextMenus();
      this._setupEventListeners();
  }

  /* ------------------------ Initialization Methods ------------------------ */

  /**
   * Initialize DOM references
   * @private
   */
  _initDomReferences() {
      this.dom = {
          menuBar: document.getElementById('menu-bar'),
          contextMenu: document.getElementById('context-menu')
      };
  }

  /**
   * Initialize main menu structure
   * @private
   */
  _initMainMenu() {
      this.menuStructure = {
          file: this._createMenuCategory('File', {
              new: this._createMenuItem('New Project', 'project:new', 'Ctrl+N'),
              open: this._createMenuItem('Open...', 'project:open', 'Ctrl+O'),
              save: this._createMenuItem('Save', 'project:save', 'Ctrl+S'),
              saveAs: this._createMenuItem('Save As...', 'project:save-as', 'Ctrl+Shift+S'),
              export: this._createSubMenu('Export', {
                  png: this._createMenuItem('As PNG', 'export:png'),
                  svg: this._createMenuItem('As SVG', 'export:svg'),
                  pdf: this._createMenuItem('As PDF', 'export:pdf')
              }),
              exit: this._createMenuItem('Exit', 'app:exit')
          }),
          edit: this._createMenuCategory('Edit', {
              undo: this._createMenuItem('Undo', 'edit:undo', 'Ctrl+Z', true),
              redo: this._createMenuItem('Redo', 'edit:redo', 'Ctrl+Y', true),
              separator1: this._createMenuSeparator(),
              cut: this._createMenuItem('Cut', 'edit:cut', 'Ctrl+X'),
              copy: this._createMenuItem('Copy', 'edit:copy', 'Ctrl+C'),
              paste: this._createMenuItem('Paste', 'edit:paste', 'Ctrl+V'),
              delete: this._createMenuItem('Delete', 'edit:delete', 'Del')
          }),
          view: this._createMenuCategory('View', {
              zoomIn: this._createMenuItem('Zoom In', 'view:zoom-in', 'Ctrl+='),
              zoomOut: this._createMenuItem('Zoom Out', 'view:zoom-out', 'Ctrl+-'),
              zoomReset: this._createMenuItem('Reset Zoom', 'view:zoom-reset', 'Ctrl+0'),
              separator1: this._createMenuSeparator(),
              grid: this._createCheckboxItem('Show Grid', 'view:toggle-grid', true),
              rulers: this._createCheckboxItem('Show Rulers', 'view:toggle-rulers', true)
          }),
          tools: this._createMenuCategory('Tools', {
              select: this._createMenuItem('Select Tool', 'tool:select', 'V'),
              line: this._createMenuItem('Line Tool', 'tool:line', 'L'),
              rectangle: this._createMenuItem('Rectangle Tool', 'tool:rect', 'R'),
              circle: this._createMenuItem('Circle Tool', 'tool:circle', 'C'),
              text: this._createMenuItem('Text Tool', 'tool:text', 'T'),
              measure: this._createMenuItem('Measure Tool', 'tool:measure', 'M')
          }),
          plugins: this._createMenuCategory('Plugins', {})
      };

      this._buildMenu();
      this._setupKeyboardShortcuts();
  }

  /**
   * Initialize context menus
   * @private
   */
  _initContextMenus() {
      this.registerContextMenu('canvas', [
          this._createMenuItem('Paste', 'edit:paste'),
          this._createMenuSeparator(),
          this._createMenuItem('Select All', 'edit:select-all'),
          this._createMenuItem('Deselect', 'edit:deselect'),
          this._createMenuSeparator(),
          this._createMenuItem('View Settings...', 'view:settings')
      ]);

      this.registerContextMenu('element', [
          this._createMenuItem('Cut', 'edit:cut'),
          this._createMenuItem('Copy', 'edit:copy'),
          this._createMenuItem('Delete', 'edit:delete'),
          this._createMenuSeparator(),
          this._createMenuItem('Bring to Front', 'element:bring-to-front'),
          this._createMenuItem('Send to Back', 'element:send-to-back'),
          this._createMenuSeparator(),
          this._createMenuItem('Properties...', 'element:properties')
      ]);
  }

  /* ------------------------ Menu Creation Utilities ------------------------ */

  /**
   * Creates a menu category structure
   * @private
   */
  _createMenuCategory(label, items) {
      return { label, items };
  }

  /**
   * Creates a menu item structure
   * @private
   */
  _createMenuItem(label, action, shortcut = null, disabled = false) {
      return { label, action, shortcut, disabled };
  }

  /**
   * Creates a checkbox menu item
   * @private
   */
  _createCheckboxItem(label, action, checked = false) {
      return { label, action, type: 'checkbox', checked };
  }

  /**
   * Creates a submenu structure
   * @private
   */
  _createSubMenu(label, items) {
      return { label, submenu: items };
  }

  /**
   * Creates a menu separator
   * @private
   */
  _createMenuSeparator() {
      return { type: 'separator' };
  }

  /* ------------------------ DOM Building Methods ------------------------ */

  /**
   * Builds the menu DOM structure
   * @private
   */
  _buildMenu() {
      this.dom.menuBar.innerHTML = '';

      Object.entries(this.menuStructure).forEach(([key, menuData]) => {
          const menuItem = this._createMenuElement(menuData);
          this.dom.menuBar.appendChild(menuItem);
      });
  }

  /**
   * Creates a menu element
   * @private
   */
  _createMenuElement(menuData) {
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
              
              if (itemData.disabled) {
                  item.classList.add('disabled');
              }
              
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
      return menuItem;
  }

  /* ------------------------ Context Menu Methods ------------------------ */

  /**
   * Registers a context menu
   * @param {string} context - Context identifier
   * @param {Array} items - Menu items
   */
  registerContextMenu(context, items) {
      this.contextMenus.set(context, items);
  }

  /**
   * Shows a context menu at specified coordinates
   * @param {string} context - Context identifier
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  showContextMenu(context, x, y) {
      const menuItems = this.contextMenus.get(context);
      if (!menuItems) return;

      this.dom.contextMenu.innerHTML = '';
      this.dom.contextMenu.style.display = 'block';
      this.dom.contextMenu.style.left = `${x}px`;
      this.dom.contextMenu.style.top = `${y}px`;

      menuItems.forEach(item => {
          if (item.type === 'separator') {
              this.dom.contextMenu.appendChild(document.createElement('hr'));
          } else {
              const menuItem = document.createElement('div');
              menuItem.className = 'context-menu-item';
              menuItem.textContent = item.label;
              menuItem.dataset.action = item.action;
              this.dom.contextMenu.appendChild(menuItem);
          }
      });

      const hideMenu = () => {
          this.dom.contextMenu.style.display = 'none';
          document.removeEventListener('click', hideMenu);
      };

      document.addEventListener('click', hideMenu);
  }

  /* ------------------------ Event Handling ------------------------ */

  /**
   * Sets up event listeners
   * @private
   */
  _setupEventListeners() {
      // Main menu and context menu item clicks
      document.addEventListener('click', (e) => {
          const menuOption = e.target.closest('.menu-option, .context-menu-item');
          if (menuOption && !menuOption.classList.contains('disabled')) {
              e.stopPropagation();
              this.eventManager.emit(menuOption.dataset.action);
          }
      });

      // Context menu triggers
      document.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          const target = e.target.closest('[data-context]');
          if (target) {
              this.showContextMenu(target.dataset.context, e.pageX, e.pageY);
          }
      });

      // Subscribe to editor events
      this.eventManager.on('project:changed', () => this.updateMenuState());
      this.eventManager.on('tool:changed', () => this._highlightActiveTool());
  }

  /**
   * Sets up keyboard shortcuts
   * @private
   */
  _setupKeyboardShortcuts() {
      this.keyboardShortcuts.clear();

      const flattenShortcuts = (items) => {
          Object.values(items).forEach(item => {
              if (item.submenu) flattenShortcuts(item.submenu);
              if (item.shortcut) this.keyboardShortcuts.set(item.shortcut, item.action);
          });
      };

      flattenShortcuts(Object.values(this.menuStructure).map(m => m.items));

      document.addEventListener('keydown', (e) => {
          const key = this._getShortcutKey(e);
          if (this.keyboardShortcuts.has(key)) {
              e.preventDefault();
              this.eventManager.emit(this.keyboardShortcuts.get(key));
          }
      });
  }

  /**
   * Gets the shortcut key combination from event
   * @private
   */
    _getShortcutKey(e) {
        const keys = [];
        if (e.ctrlKey || e.metaKey) keys.push('Ctrl');
        if (e.shiftKey) keys.push('Shift');
        if (e.altKey) keys.push('Alt');
        keys.push(e.key.toUpperCase());
        return keys.join('+');
    }

    _initWithExistingHtml() {
        // Gebruik bestaande HTML in plaats van dynamisch genereren
        this.menus = {
            file: {
                new: document.querySelector('[data-action="project:new"]'),
                save: document.querySelector('[data-action="project:save"]'),
                // ... andere items
            },
            // ... andere menu categorieën
        };
    }

    _setupEventListeners() {
        // Koppel menu items aan events
        Object.values(this.menus).forEach(menu => {
            Object.entries(menu).forEach(([action, element]) => {
                if (element && element.dataset.action) {
                    element.addEventListener('click', () => {
                        this.eventManager.emit(element.dataset.action);
                    });
                }
            });
        });
        
        // Update menu state bij wijzigingen
        this.eventManager.on('project:changed', () => this._updateMenuStates());
    }

  /* ------------------------ Menu State Management ------------------------ */

  /**
   * Updates menu state based on application state
   */
  updateMenuState() {

    // Update undo/redo states
    this.menus.edit.undo.disabled = !this.editor.projectManager.canUndo();
    this.menus.edit.redo.disabled = !this.editor.projectManager.canRedo();
    
    // Update checkbox states
    this.menus.view.grid.classList.toggle('checked', 
    this.editor.viewportManager.gridVisible);

      // Update undo/redo states
      document.querySelectorAll('[data-action="edit:undo"]').forEach(item => {
          item.classList.toggle('disabled', !this.editor.projectManager.canUndo());
      });
      document.querySelectorAll('[data-action="edit:redo"]').forEach(item => {
          item.classList.toggle('disabled', !this.editor.projectManager.canRedo());
      });

      // Update checkbox states
      document.querySelectorAll('.menu-option.checkbox').forEach(item => {
          const action = item.dataset.action;
          const checked = this._getCheckboxState(action);
          item.classList.toggle('checked', checked);
      });
  }

  /**
   * Highlights the active tool in the menu
   * @private
   */
  _highlightActiveTool() {
      document.querySelectorAll('[data-action^="tool:"]').forEach(item => {
          item.classList.remove('active');
      });

      const activeTool = this.editor.toolManager.activeTool;
      if (activeTool) {
          const toolItem = document.querySelector(`[data-action="tool:${activeTool}"]`);
          if (toolItem) toolItem.classList.add('active');
      }
  }

  /**
   * Gets checkbox state from editor
   * @private
   */
  _getCheckboxState(action) {
      switch (action) {
          case 'view:toggle-grid':
              return this.editor.viewportManager.gridVisible;
          case 'view:toggle-rulers':
              return this.editor.viewportManager.rulersVisible;
          default:
              return false;
      }
  }

  /* ------------------------ Plugin Integration ------------------------ */

  /**
   * Adds a plugin menu item
   * @param {string} pluginName - Name of the plugin
   * @param {Object} menuItems - Menu items structure
   */
  addPluginMenuItem(pluginName, menuItems) {
      if (!this.pluginMenus.has(pluginName)) {
          this.menuStructure.plugins.items[pluginName] = this._createSubMenu(pluginName, {});
          this.pluginMenus.set(pluginName, this.menuStructure.plugins.items[pluginName].submenu);
      }

      const pluginMenu = this.pluginMenus.get(pluginName);
      Object.assign(pluginMenu, menuItems);
      this._buildMenu();
      this._setupKeyboardShortcuts();
  }
}