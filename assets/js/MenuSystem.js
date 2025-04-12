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
        const key = `${e.ctrlKey||e.metaKey?'Ctrl+':''}${e.shiftKey?'Shift+':''}${e.key.toUpperCase()}`;
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