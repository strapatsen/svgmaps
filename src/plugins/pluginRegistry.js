// plugins/pluginRegistry.js
import { PluginBase } from './PluginBase.js';

export class PluginRegistry {
    /**
     * Creates a new PluginRegistry instance
     * @param {Editor} editor - Reference to the main editor instance
     */
    constructor(editor) {
        this.editor = editor;
        this._plugins = new Map();
        this._pluginCategories = new Map();
        this._loadedPlugins = new Map();
    }

    /* ------------------------ Public API ------------------------ */

    /**
     * Registers a plugin class
     * @param {string} name - Unique plugin name
     * @param {class} pluginClass - Plugin class extending PluginBase
     * @param {Object} metadata - Plugin metadata
     * @param {string} [category='uncategorized'] - Plugin category
     * @returns {boolean} True if registration succeeded
     */
    register(name, pluginClass, metadata = {}, category = 'uncategorized') {
        if (this._plugins.has(name)) {
            console.warn(`Plugin ${name} is already registered`);
            return false;
        }

        if (!this._isValidPluginClass(pluginClass)) {
            console.error(`Plugin ${name} must extend PluginBase`);
            return false;
        }

        this._plugins.set(name, {
            class: pluginClass,
            metadata: {
                name,
                version: '1.0.0',
                description: '',
                author: '',
                ...metadata
            },
            category
        });

        if (!this._pluginCategories.has(category)) {
            this._pluginCategories.set(category, new Set());
        }
        this._pluginCategories.get(category).add(name);

        this.editor.eventManager.emit('plugin:registered', { name, category });
        return true;
    }

    /**
     * Loads and initializes a plugin
     * @param {string} name - Plugin name to load
     * @param {Object} [options] - Plugin initialization options
     * @returns {PluginBase|null} Loaded plugin instance or null
     */
    load(name, options = {}) {
        if (this._loadedPlugins.has(name)) {
            return this._loadedPlugins.get(name);
        }

        const pluginInfo = this._plugins.get(name);
        if (!pluginInfo) {
            console.error(`Plugin ${name} is not registered`);
            return null;
        }

        try {
            const pluginInstance = new pluginInfo.class(this.editor, options);
            
            // Set name and version from metadata if not set by plugin
            if (!pluginInstance.name) pluginInstance.name = pluginInfo.metadata.name;
            if (!pluginInstance.version) pluginInstance.version = pluginInfo.metadata.version;

            // Initialize the plugin
            if (typeof pluginInstance.init === 'function') {
                pluginInstance.init();
            }

            this._loadedPlugins.set(name, pluginInstance);
            this.editor.eventManager.emit('plugin:loaded', { 
                name, 
                instance: pluginInstance 
            });

            return pluginInstance;
        } catch (error) {
            console.error(`Failed to load plugin ${name}:`, error);
            this.editor.eventManager.emit('plugin:load-error', { 
                name, 
                error 
            });
            return null;
        }
    }

    /**
     * Unloads a plugin
     * @param {string} name - Plugin name to unload
     * @returns {boolean} True if plugin was unloaded
     */
    unload(name) {
        if (!this._loadedPlugins.has(name)) {
            return false;
        }

        const pluginInstance = this._loadedPlugins.get(name);
        
        try {
            if (typeof pluginInstance.destroy === 'function') {
                pluginInstance.destroy();
            }
        } catch (error) {
            console.error(`Error during plugin ${name} destruction:`, error);
        }

        this._loadedPlugins.delete(name);
        this.editor.eventManager.emit('plugin:unloaded', { name });
        return true;
    }

    /**
     * Gets a loaded plugin instance
     * @param {string} name - Plugin name
     * @returns {PluginBase|null} Plugin instance or null
     */
    get(name) {
        return this._loadedPlugins.get(name) || null;
    }

    /**
     * Gets all plugins in a category
     * @param {string} category - Category name
     * @returns {Array} List of plugin metadata
     */
    getByCategory(category) {
        if (!this._pluginCategories.has(category)) {
            return [];
        }
        
        return Array.from(this._pluginCategories.get(category)).map(name => {
            return this._plugins.get(name).metadata;
        });
    }

    /**
     * Gets all registered plugin metadata
     * @returns {Array} List of all plugin metadata
     */
    getAll() {
        return Array.from(this._plugins.values()).map(info => info.metadata);
    }

    /**
     * Gets all loaded plugin instances
     * @returns {Array} List of plugin instances
     */
    getLoaded() {
        return Array.from(this._loadedPlugins.values());
    }

    /* ------------------------ Private Methods ------------------------ */

    /**
     * Validates if a class extends PluginBase
     * @private
     */
    _isValidPluginClass(pluginClass) {
        try {
            const tempInstance = new pluginClass(this.editor);
            return tempInstance instanceof PluginBase;
        } catch {
            return false;
        }
    }
}

// Built-in plugin registration helper
export function registerBuiltinPlugins(registry) {
    
    // Example built-in plugin registrations:
    registry.register('Measurement', MeasurementPlugin, {
        description: 'Measurement tools for distances and areas',
        author: 'System'
    }, 'measurement');

    registry.register('ImportExport', ImportExportPlugin, {
        description: 'Import/export functionality',
        author: 'System'
    }, 'io');

    
    // Add more built-ins as needed
}