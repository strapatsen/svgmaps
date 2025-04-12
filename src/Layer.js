// Layer.js
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