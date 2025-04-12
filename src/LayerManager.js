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