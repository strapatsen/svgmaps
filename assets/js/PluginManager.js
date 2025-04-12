// Plugin Manager
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