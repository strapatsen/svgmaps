// PluginManager.js
export class PluginManager {
    /**
     * Creates a new PluginManager instance
     * @param {EventManager} eventManager - The application's event manager
     * @param {Editor} app - Reference to the main editor instance
     */
    constructor(eventManager, app) {
        this._plugins = new Map();
        this._eventManager = eventManager;
        this._app = app;
        this._pluginTypes = new Map();
    }

    /* ------------------------ Public Methods ------------------------ */

    /**
     * Loads built-in plugins
     * @async
     * @param {Array} pluginList - List of built-in plugins to load
     * @returns {Promise<Array>} List of loaded plugin names
     */
    async loadBuiltinPlugins(pluginList) {
        return this._loadPlugins(pluginList, 'builtin');
    }

    /**
     * Loads external plugins
     * @async
     * @param {Array} plugins - List of external plugins to load
     * @returns {Promise<Array>} List of loaded plugin names
     */
    async loadExternalPlugins(plugins) {
        return this._loadPlugins(plugins, 'external');
    }

    /**
     * Registers a new plugin
     * @param {string} name - Plugin name
     * @param {class} PluginClass - The plugin class
     * @param {string} type - Plugin type ('builtin'|'external'|'custom')
     * @param {Object} [menuItems] - Optional menu items structure
     * @param {Object} [options] - Additional plugin options
     * @returns {boolean} True if registration was successful
     */
    registerPlugin(name, PluginClass, type = 'custom', menuItems = {}, options = {}) {
        if (this._plugins.has(name)) {
            this._handleError(`Plugin "${name}" is already registered`, name);
            return false;
        }

        try {
            const instance = new PluginClass(this._app, options);
            this._plugins.set(name, instance);
            this._pluginTypes.set(name, type);

            if (Object.keys(menuItems).length > 0 && this._app.menuSystem) {
                this._app.menuSystem.addPluginMenuItem(name, menuItems);
            }

            this._eventManager.emit('plugin:registered', {
                name,
                type,
                instance
            });

            return true;
        } catch (error) {
            this._handleError(error, name);
            return false;
        }
    }

    /**
     * Gets a plugin instance by name
     * @param {string} name - Plugin name
     * @returns {Object|null} Plugin instance or null if not found
     */
    getPlugin(name) {
        return this._plugins.get(name) || null;
    }

    /**
     * Gets all plugins of a specific type
     * @param {string} type - Plugin type to filter by
     * @returns {Array} List of plugin instances
     */
    getPluginsByType(type) {
        const result = [];
        for (const [name, instance] of this._plugins) {
            if (this._pluginTypes.get(name) === type) {
                result.push(instance);
            }
        }
        return result;
    }

    /**
     * Unregisters a plugin
     * @param {string} name - Plugin name to unregister
     * @returns {boolean} True if plugin was removed
     */
    unregisterPlugin(name) {
        if (!this._plugins.has(name)) {
            return false;
        }

        const plugin = this._plugins.get(name);

        // Cleanup if plugin has destroy method
        if (typeof plugin.destroy === 'function') {
            try {
                plugin.destroy();
            } catch (error) {
                this._handleError(error, name);
            }
        }

        this._plugins.delete(name);
        this._pluginTypes.delete(name);
        this._eventManager.emit('plugin:unregistered', { name });

        return true;
    }

    /* ------------------------ Private Methods ------------------------ */

    /**
     * Loads multiple plugins
     * @private
     * @async
     * @param {Array} plugins - List of plugins to load
     * @param {string} type - Plugin type
     * @returns {Promise<Array>} List of loaded plugin names
     */
    async _loadPlugins(plugins, type) {
        const loadedPlugins = [];

        for (const plugin of plugins) {
            try {
                const module = await this._loadPluginModule(plugin.path);
                const success = this.registerPlugin(
                    plugin.name,
                    module.default,
                    type,
                    plugin.menuItems,
                    plugin.options || {}
                );

                if (success) {
                    loadedPlugins.push(plugin.name);
                }
            } catch (error) {
                this._handleError(error, plugin.name);
            }
        }

        return loadedPlugins;
    }

    /**
     * Loads a plugin module
     * @private
     * @async
     * @param {string} path - Path to the plugin module
     * @returns {Promise<Object>} The imported module
     */
    async _loadPluginModule(path) {
        try {
            return await import(path);
        } catch (error) {
            throw new Error(`Failed to load module: ${path} - ${error.message}`);
        }
    }

    /**
     * Handles plugin errors
     * @private
     * @param {Error|string} error - The error object or message
     * @param {string} pluginName - Name of the plugin that caused the error
     */
    _handleError(error, pluginName) {
        const errorMessage = typeof error === 'string' ? error : error.message;
        const fullMessage = `Plugin "${pluginName}" error: ${errorMessage}`;

        console.error(fullMessage, typeof error === 'object' ? error : '');

        this._eventManager.emit('plugin:error', {
            name: pluginName,
            error: errorMessage,
            stack: typeof error === 'object' ? error.stack : null
        });
    }
}

// Plugin lifecycle events documentation:
/**
 * @event plugin:registered - Fired when a plugin is successfully registered
 * @property {string} name - Plugin name
 * @property {string} type - Plugin type
 * @property {Object} instance - Plugin instance
 */

/**
 * @event plugin:unregistered - Fired when a plugin is unregistered
 * @property {string} name - Plugin name
 */

/**
 * @event plugin:error - Fired when a plugin error occurs
 * @property {string} name - Plugin name
 * @property {string} error - Error message
 * @property {string|null} stack - Error stack trace if available
 */