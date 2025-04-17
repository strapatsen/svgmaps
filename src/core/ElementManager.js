// src/core/ElementManager.js
export class ElementManager {
  constructor(eventManager, layerManager) {
      this._eventManager = eventManager;
      this._layerManager = layerManager;
      this._elementTypes = [];
      this._selectedElement = null;
      this._hoveredElement = null;
      this._tempElement = null;
      this._elementCount = 0;
      this._lastPosition = null;
      this._tools = {};

      this._init();
  }

  /* ------------------------ Initialization ------------------------ */

  async _init() {
      await this._loadElementTypes();
      this._initTools();
      this._setupEventListeners();
  }

  async _loadElementTypes() {
      try {
          const response = await fetch('data/element-types.json');
          const data = await response.json();
          this._elementTypes = data.elementTypes || [];
          this._eventManager.emit('element-types:loaded', this._elementTypes);
      } catch (error) {
          console.error('Failed to load element types:', error);
          this._eventManager.emit('element-types:error', error);
      }
  }

  _initTools() {
      this._tools = {
          select: this._handleSelectTool.bind(this),
          move: this._handleMoveTool.bind(this),
          resize: this._handleResizeTool.bind(this),
          rotate: this._handleRotateTool.bind(this),
      };
  }

  _setupEventListeners() {
      this._eventManager.on('canvas:click', pos => this._handleCanvasClick(pos));
      this._eventManager.on('canvas:drag', pos => this._handleCanvasDrag(pos));
      this._eventManager.on('canvas:release', pos => this._handleCanvasRelease(pos));
      
      this._eventManager.on('element:select', element => this.selectElement(element));
      this._eventManager.on('element:deselect', () => this.deselectElement());
  }

  /* ------------------------ Element Management ------------------------ */

  createElement(type, shape, options = {}) {
      const layer = this._layerManager.getActiveLayer();
      if (!layer || layer.locked) return null;

      if (!this._isValidElementType(type)) {
          console.warn(`Invalid element type: ${type}`);
          return null;
      }

      const element = new TerrainElement(type, shape, {
          ...options,
          layerId: layer.id
      });

      layer.addElement(element);
      this._elementCount++;

      this._eventManager.emit('element:created', {
          element: element.serialize(),
          layerId: layer.id
      });

      return element;
  }

  _isValidElementType(type) {
      return this._elementTypes.some(t => t.value === type);
  }

  /* ------------------------ Selection Handling ------------------------ */

  selectElement(element) {
      if (this._selectedElement === element) return;
      
      this.deselectElement();
      this._selectedElement = element;
      
      this._eventManager.emit('element:selected', {
          element: element.serialize(),
          properties: this.getElementProperties(element)
      });
  }

  deselectElement() {
      if (!this._selectedElement) return;
      
      const previousElement = this._selectedElement;
      this._selectedElement = null;
      
      this._eventManager.emit('element:deselected', {
          element: previousElement.serialize()
      });
  }

  deleteElement(element) {
      const layer = this._layerManager.getLayer(element.layerId);
      if (!layer || layer.locked) return false;

      const deleted = layer.removeElement(element.id);
      if (!deleted) return false;

      this._elementCount--;
      
      if (this._selectedElement === element) {
          this.deselectElement();
      }
      
      this._eventManager.emit('element:deleted', {
          elementId: element.id,
          layerId: layer.id
      });

      return true;
  }

  /* ------------------------ Element Properties ------------------------ */
  
  getElementProperties(element) {
      
    if (!element) return null;

      const baseProps = {
          id: element.id,
          type: element.type,
          name: element.name,
          x: element.x,
          y: element.y,
          width: element.width,
          height: element.height,
          rotation: element.rotation,
          color: element.color,
          visible: element.visible,
          locked: element.locked
      };

      // Type-specific properties
      const typeConfig = this._elementTypes.find(t => t.value === element.type);
      if (!typeConfig) return baseProps;

      const metadataProps = {};
      typeConfig.properties?.forEach(prop => {
          metadataProps[prop.name] = element.metadata[prop.name] || prop.default;
      });

      return { ...baseProps, ...metadataProps };
  }

  updateElement(element, properties) {
      const changes = {};
      const metadataChanges = {};

      Object.entries(properties).forEach(([key, value]) => {
          if (key in element) {
              element[key] = value;
              changes[key] = value;
          } else {
              element.metadata[key] = value;
              metadataChanges[key] = value;
          }
      });

      if (Object.keys(changes).length > 0 || Object.keys(metadataChanges).length > 0) {
          this._eventManager.emit('element:updated', {
              element: element.serialize(),
              properties: changes,
              metadata: metadataChanges
          });
      }
  }

  /* ------------------------ Canvas Interaction ------------------------ */

  _handleCanvasClick(pos) {
      if (this._tempElement) {
          this._finalizeTempElement(pos);
          return;
      }

      const element = this.getElementAtPosition(pos);
      element ? this.selectElement(element) : this.deselectElement();
  }
  
  _handleCanvasDrag(pos) {
      if (this._selectedElement && !this._selectedElement.locked) {
          this._tools.move(pos);
      }
  }

  _handleCanvasRelease(pos) {
      if (this._selectedElement) {
          this._eventManager.emit('element:modified', {
              element: this._selectedElement.serialize()
          });
      }
  }

  /* ------------------------ Tool Handlers ------------------------ */

  _handleSelectTool(pos) {
      const element = this.getElementAtPosition(pos);
      this.selectElement(element);
  }
  
  _handleMoveTool(pos) {
   
    if (!this._selectedElement) return;

      const dx = pos.x - (this._lastPosition?.x || pos.x);
      const dy = pos.y - (this._lastPosition?.y || pos.y);
      
      this._selectedElement.move(dx, dy);
      this._lastPosition = pos;
      
      this._eventManager.emit('element:moving', {
          element: this._selectedElement.serialize(),
          dx,
          dy
      });
  }

  /* ------------------------ Element Querying ------------------------ */

  getElementAtPosition(pos) {
      // Check layers in reverse order (top to bottom)
      const layers = this._layerManager.getLayers();
      for (let i = layers.length - 1; i >= 0; i--) {
          const layer = layers[i];
          if (!layer.visible) continue;

          // Check elements in reverse order (newest first)
          const elements = layer.getElements();
          for (let j = elements.length - 1; j >= 0; j--) {
              const element = elements[j];
              if (!element.visible) continue;

              if (this._isPositionInElement(pos, element)) {
                  return element;
              }
          }
      }
      return null;
  }

  _isPositionInElement(pos, element) {
      const hitTestStrategies = {
          rect: (pos, el) => 
              pos.x >= el.x && 
              pos.x <= el.x + el.width &&
              pos.y >= el.y && 
              pos.y <= el.y + el.height,
          circle: (pos, el) => {
              const radius = el.width / 2;
              const dx = pos.x - (el.x + radius);
              const dy = pos.y - (el.y + radius);
              return Math.sqrt(dx * dx + dy * dy) <= radius;
          },
          polygon: (pos, el) => this._pointInPolygon(pos, el.points)
      };

      const strategy = hitTestStrategies[element.shape];
      return strategy ? strategy(pos, element) : false;
  }

  _pointInPolygon(point, polygon) {
      if (!polygon || polygon.length < 3) return false;

      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
          const xi = polygon[i].x, yi = polygon[i].y;
          const xj = polygon[j].x, yj = polygon[j].y;
          
          const intersect = ((yi > point.y) !== (yj > point.y)) &&
              (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
          if (intersect) inside = !inside;
      }
      return inside;
  }

  /* ------------------------ Serialization ------------------------ */

  getSnapshot() {
      return {
          elements: this._layerManager.getLayers().flatMap(layer => layer.getElements().map(el => el.serialize()))
      };
  }

  restoreSnapshot(snapshot) {
      if (!snapshot?.elements) return false;

      this._layerManager.getLayers().forEach(layer => {
          layer.getElements().forEach(el => layer.removeElement(el.id));
      });

      snapshot.elements.forEach(elData => {
          const layer = this._layerManager.getLayer(elData.layerId);
          if (layer) {
              layer.addElement(TerrainElement.deserialize(elData));
          }
      });

      return true;
  }

  /* ------------------------ Getters ------------------------ */

  get selectedElement() {
      return this._selectedElement;
  }

  get elementCount() {
      return this._elementCount;
  }

  getElementTypes() {
      return [...this._elementTypes];
  }
}