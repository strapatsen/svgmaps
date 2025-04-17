// plugins/PluginBase.js
export class PluginBase {
    /**
     * Base plugin constructor
     * @param {Editor} app - Reference to editor instance
     * @param {Object} [options] - Plugin options
     */
    constructor(app, options = {}) {
        if (!app) {
            throw new Error('Plugin requires reference to Editor instance');
        }

        this.app = app;
        this.name = 'Unnamed Plugin';
        this.version = '1.0.0';
        this.description = '';
        this.author = '';
        this.icon = '🔌'; // Plugin icon
        this.isBuiltin = false;
        this.options = {
            enabledByDefault: true,
            ...options
        };
        
        // State management
        this._state = {
            isActive: false,
            isEnabled: this.options.enabledByDefault,
            isInitialized: false,
            isDestroyed: false,
            isLoading: false
        };
        
        this._eventHandlers = new Map();
        this._menuItems = new Map();
        this._registeredTools = new Set();
    }
    
    /* ------------------------ Lifecycle Methods ------------------------ */
    
    /**
     * Initializes the plugin
     * @async
     */
    async init() {
        if (this._state.isInitialized) {
            this.log('Plugin already initialized');
            return;
        }

        this._state.isLoading = true;
        
        try {
            await this._onInit();
            this._state.isInitialized = true;
            this._state.isActive = true;
            this.app.eventManager.emit('plugin:initialized', this._getPluginInfo());
        } catch (error) {
            this._handleError('Initialization failed', error);
        } finally {
            this._state.isLoading = false;
        }
    }
    
    /**
     * Cleans up plugin resources
     */
    async destroy() {
        if (this._state.isDestroyed) return;

        this._state.isLoading = true;
        
        try {
            await this._onDestroy();
            
            // Cleanup registered items
            this._unregisterAllEvents();
            this._removeAllMenuItems();
            this._unregisterAllTools();
            
            this._state = {
                isActive: false,
                isEnabled: false,
                isInitialized: false,
                isDestroyed: true,
                isLoading: false
            };
            
            this.app.eventManager.emit('plugin:destroyed', this._getPluginInfo());
        } catch (error) {
            this._handleError('Destruction failed', error);
        } finally {
            this._state.isLoading = false;
        }
    }

    /* ------------------------ Protected Methods ------------------------ */
    
    /**
     * Plugin-specific initialization (override in subclasses)
     * @protected
     * @async
     */
    async _onInit() {
        // Can be overridden by subclasses
    }
    
    /**
     * Plugin-specific cleanup (override in subclasses)
     * @protected
     * @async
     */
    async _onDestroy() {
        // Can be overridden by subclasses
    }
    
    /**
     * Handles errors consistently
     * @protected
     */
    _handleError(message, error) {
        const errorMsg = typeof error === 'string' ? error : error.message;
        const fullMessage = `[${this.name}] ${message}: ${errorMsg}`;
        
        console.error(fullMessage, error);
        this.app.eventManager.emit('plugin:error', {
            plugin: this.name,
            message,
            error: errorMsg,
            stack: error.stack
        });
    }
    
    /* ------------------------ Event Management ------------------------ */
    
    /**
     * Registers an event handler
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     */
    _registerEvent(event, handler) {
        if (!this._eventHandlers.has(event)) {
            this._eventHandlers.set(event, new Set());
        }
        this._eventHandlers.get(event).add(handler);
        this.app.eventManager.on(event, handler);
    }
    
    /**
     * Unregisters all event handlers
     */
    _unregisterAllEvents() {
        for (const [event, handlers] of this._eventHandlers) {
            for (const handler of handlers) {
                this.app.eventManager.off(event, handler);
            }
        }
        this._eventHandlers.clear();
    }
    
    /* ------------------------ Menu Management ------------------------ */
    
    /**
     * Adds menu items to the editor
     * @param {Object} items - Menu items structure
     */
    addMenuItems(items) {
        if (!this.app.menuSystem) return;

        Object.entries(items).forEach(([id, item]) => {
            this._menuItems.set(id, item);
            this.app.menuSystem.addPluginMenuItem(this.name, { [id]: item });
        });
    }
    
    /**
     * Removes all menu items added by this plugin
     */
    _removeAllMenuItems() {
        if (!this.app.menuSystem || !this.app.menuSystem.removePluginMenuItems) return;
        
        this.app.menuSystem.removePluginMenuItems(this.name);
        this._menuItems.clear();
    }
    
    /* ------------------------ Tool Management ------------------------ */
    
    /**
     * Adds tools to the editor
     * @param {Array} tools - List of tool definitions
     */
    addTools(tools) {
        if (!this.app.toolManager) return;

        tools.forEach(tool => {
            this._registeredTools.add(tool.name);
            this.app.toolManager.register(tool.name, tool.ToolClass);
        });
    }
    
    /**
     * Unregisters all tools added by this plugin
     */
    _unregisterAllTools() {
        if (!this.app.toolManager) return;

        this._registeredTools.forEach(toolName => {
            this.app.toolManager.unregister(toolName);
        });
        this._registeredTools.clear();
    }
    
    /* ------------------------ Utility Methods ------------------------ */
    
    /**
     * Logs a message with plugin prefix
     * @param {string} message - Message to log
     * @param {string} [level=log] - Log level (log, warn, error)
     */
    log(message, level = 'log') {
        const prefix = `[${this.name}]`;
        const logMethod = console[level] || console.log;
        logMethod(prefix, message);
    }
    
    /**
     * Gets plugin information
     * @returns {Object} Plugin metadata and state
     */
    _getPluginInfo() {
        return {
            name: this.name,
            version: this.version,
            description: this.description,
            author: this.author,
            icon: this.icon,
            isBuiltin: this.isBuiltin,
            state: { ...this._state },
            options: { ...this.options }
        };
    }
    
    /**
     * Enables/disables the plugin
     * @param {boolean} enabled - Whether to enable or disable
     */
    setEnabled(enabled) {
        if (this.isBuiltin) return; // Built-in plugins can't be disabled
        
        this._state.isEnabled = enabled;
        if (enabled && !this._state.isActive) {
            this.init().catch(error => {
                this._handleError('Enable failed', error);
            });
        } else if (!enabled && this._state.isActive) {
            this.destroy().catch(error => {
                this._handleError('Disable failed', error);
            });
        }
    }
}