// LayerManager.js
export class LayerManager {
  constructor(eventManager) {
      this._eventManager = eventManager;
      this._layers = [];
      this._activeLayerIndex = 0;
      this._initEventListeners();
  }

  /* ------------------------ Public API ------------------------ */

  addLayer(name = `Layer ${this._layers.length + 1}`, options = {}) {
      const layer = new Layer(this._generateLayerId(), name, options);
      this._layers.push(layer);
      
      this._eventManager.emit('layer:added', {
          layer: layer.serialize(),
          index: this._layers.length - 1
      });
      
      return layer;
  }

  removeLayer(layerId) {
      const index = this._getLayerIndex(layerId);
      if (index === -1) return false;
      
      const [removedLayer] = this._layers.splice(index, 1);
      this._adjustActiveIndexAfterRemoval(index);
      
      this._eventManager.emit('layer:removed', {
          layerId: removedLayer.id,
          index
      });
      
      return true;
  }

  moveLayer(layerId, direction) {
      const index = this._getLayerIndex(layerId);
      if (index === -1) return false;
      
      const newIndex = index + direction;
      if (!this._isValidIndex(newIndex)) return false;
      
      this._swapLayers(index, newIndex);
      this._updateActiveIndexAfterMove(index, newIndex);
      
      this._eventManager.emit('layers:reordered', {
          movedLayerId: layerId,
          fromIndex: index,
          toIndex: newIndex
      });
      
      return true;
  }

  setActiveLayer(layerId) {
      const index = this._getLayerIndex(layerId);
      if (index === -1) return false;
      
      this._activeLayerIndex = index;
      this._eventManager.emit('layer:activated', {
          layer: this._layers[index].serialize(),
          index
      });
      return true;
  }

  loadFromJSON(layersJSON) {
      this._layers = layersJSON.map(json => Layer.deserialize(json));
      this._clampActiveIndex();
      
      this._eventManager.emit('layers:loaded', {
          count: this._layers.length
      });
  }

  /* ------------------------ Getters ------------------------ */

  getActiveLayer() {
      return this._layers[this._activeLayerIndex] || null;
  }

  getLayer(layerId) {
      return this._layers.find(layer => layer.id === layerId) || null;
  }

  getLayers() {
      return [...this._layers]; // Return copy for immutability
  }

  serialize() {
      return this._layers.map(layer => layer.serialize());
  }

  /* ------------------------ Private Methods ------------------------ */

  _initEventListeners() {
      this._eventManager.on('layer:add', () => this.addLayer());
      this._eventManager.on('layer:remove', layerId => this.removeLayer(layerId));
      this._eventManager.on('layer:select', layerId => this.setActiveLayer(layerId));
  }

  _generateLayerId() {
      return `layer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  _getLayerIndex(layerId) {
      return this._layers.findIndex(layer => layer.id === layerId);
  }

  _isValidIndex(index) {
      return index >= 0 && index < this._layers.length;
  }

  _adjustActiveIndexAfterRemoval(removedIndex) {
      if (this._activeLayerIndex >= removedIndex) {
          this._activeLayerIndex = Math.max(0, this._activeLayerIndex - 1);
      }
  }

  _swapLayers(indexA, indexB) {
      [this._layers[indexA], this._layers[indexB]] = 
          [this._layers[indexB], this._layers[indexA]];
  }

  _updateActiveIndexAfterMove(oldIndex, newIndex) {
      if (this._activeLayerIndex === oldIndex) {
          this._activeLayerIndex = newIndex;
      } else if (this._activeLayerIndex === newIndex) {
          this._activeLayerIndex = oldIndex;
      }
  }

  _clampActiveIndex() {
      this._activeLayerIndex = Math.min(
          this._activeLayerIndex,
          Math.max(0, this._layers.length - 1)
      );
  }
}