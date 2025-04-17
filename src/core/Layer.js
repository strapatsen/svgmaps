// Layer.js
export class Layer {
  constructor(id, name, options = {}) {
      this._id = id;
      this._name = name || `Layer ${id}`;
      this._visible = options.visible !== false;
      this._locked = options.locked || false;
      this._opacity = Math.min(1.0, Math.max(0, options.opacity || 1.0));
      this._elements = [];
      this._metadata = options.metadata || {};
  }

  /* ------------------------ Element Management ------------------------ */

  addElement(element) {
      if (!element?.isTerrainElement) {
          throw new Error('Only TerrainElement instances can be added to a layer');
      }
      
      element.layerId = this._id;
      this._elements.push(element);
      return element;
  }

  removeElement(elementId) {
      const index = this._elements.findIndex(el => el.id === elementId);
      return index !== -1 ? this._elements.splice(index, 1)[0] : null;
  }

  getElement(elementId) {
      return this._elements.find(el => el.id === elementId) || null;
  }

  getElements() {
      return [...this._elements]; // Return copy for immutability
  }

  /* ------------------------ Layer Properties ------------------------ */

  setVisible(visible) {
      this._visible = !!visible;
  }

  setLocked(locked) {
      this._locked = !!locked;
  }

  setOpacity(opacity) {
      this._opacity = Math.min(1.0, Math.max(0, opacity));
  }

  updateMetadata(updates) {
      this._metadata = { ...this._metadata, ...updates };
  }

  /* ------------------------ Serialization ------------------------ */

  serialize() {
      return {
          id: this._id,
          name: this._name,
          visible: this._visible,
          locked: this._locked,
          opacity: this._opacity,
          elements: this._elements.map(el => el.serialize()),
          metadata: { ...this._metadata }
      };
  }

  static deserialize(json) {
      const layer = new Layer(
          json.id,
          json.name,
          {
              visible: json.visible,
              locked: json.locked,
              opacity: json.opacity,
              metadata: json.metadata
          }
      );
      
      json.elements?.forEach(elJson => {
          layer.addElement(TerrainElement.deserialize(elJson));
      });
      
      return layer;
  }

  /* ------------------------ Getters ------------------------ */

  get id() { return this._id; }
  get name() { return this._name; }
  get visible() { return this._visible; }
  get locked() { return this._locked; }
  get opacity() { return this._opacity; }
  get metadata() { return { ...this._metadata }; }
  get elementCount() { return this._elements.length; }
}