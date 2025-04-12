class ElementManager {

  constructor(eventManager, layerManager) {
      this.elementTypes = [];
      this.loadElementTypes();
      this.eventManager = eventManager;
      this.layerManager = layerManager;
      this.selectedElement = null;
      this.hoveredElement = null;
      this.tempElement = null;
      this.elementCount = 0;
      this.lastPosition = null;
    
      this.setupEventListeners();
      this.initTools();
     
    }
  
    async loadElementTypes() {
      const response = await fetch('data/element-types.json');
      const data = await response.json();
      this.elementTypes = data.elementTypes;
    }
  
    setupEventListeners() {
      this.eventManager.on('canvas:click', (pos) => this.handleCanvasClick(pos));
      this.eventManager.on('canvas:drag', (pos) => this.handleCanvasDrag(pos));
      this.eventManager.on('canvas:release', (pos) => this.handleCanvasRelease(pos));
      
      this.eventManager.on('element:select', (element) => this.selectElement(element));
      this.eventManager.on('element:deselect', () => this.deselectElement());
    }
  
    initTools() {
      this.elementTools = {
        select: this.handleSelectTool.bind(this),
        move: this.handleMoveTool.bind(this),
        resize: this.handleResizeTool.bind(this),
        rotate: this.handleRotateTool.bind(this)
      };
    }
  
    createElement(type, shape, options = {}) {
      const layer = this.layerManager.getActiveLayer();
      if (!layer || layer.locked) return null;
  
      const element = new TerrainElement(type, shape, {
        ...options,
        layerId: layer.id
      });
  
      layer.addElement(element);
      this.elementCount++;
  
      this.eventManager.emit('element:created', {
        element,
        layerId: layer.id
      });
  
      return element;
    }
  
    selectElement(element) {
      if (this.selectedElement === element) return;
      
      this.deselectElement();
      this.selectedElement = element;
      
      this.eventManager.emit('element:selected', {
        element,
        properties: this.getElementProperties(element)
      });
    }
  
    deselectElement() {
      if (!this.selectedElement) return;
      
      const previousElement = this.selectedElement;
      this.selectedElement = null;
      
      this.eventManager.emit('element:deselected', {
        element: previousElement
      });
    }
  
    deleteElement(element) {
      const layer = this.layerManager.layers.find(l => l.id === element.layerId);
      if (!layer || layer.locked) return false;
  
      const deleted = layer.removeElement(element.id);
      if (deleted) {
        this.elementCount--;
        
        if (this.selectedElement === element) {
          this.deselectElement();
        }
        
        this.eventManager.emit('element:deleted', {
          elementId: element.id,
          layerId: layer.id
        });
      }
      
      return !!deleted;
    }
  
    getElementProperties(element) {
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
      switch (element.type) {
        case 'power-point':
          return {
            ...baseProps,
            voltage: element.metadata.voltage || 230,
            wattage: element.metadata.wattage || 0,
            circuit: element.metadata.circuit || 1
          };
        case 'water-pipe':
          return {
            ...baseProps,
            diameter: element.metadata.diameter || 50,
            flowDirection: element.metadata.flowDirection || 'none'
          };
        default:
          return baseProps;
      }
    }
  
    updateElement(element, properties) {
      // Update basic properties
      Object.keys(properties).forEach(key => {
        if (key in element) {
          element[key] = properties[key];
        } else {
          element.metadata[key] = properties[key];
        }
      });
  
      this.eventManager.emit('element:updated', {
        element,
        properties
      });
    }
  
    // Canvas interaction handlers
    handleCanvasClick(pos) {
      if (this.tempElement) {
        this.finalizeTempElement(pos);
        return;
      }
  
      const element = this.getElementAtPosition(pos);
      if (element) {
        this.selectElement(element);
      } else {
        this.deselectElement();
      }
    }
  
    handleCanvasDrag(pos) {
      if (this.selectedElement && !this.selectedElement.locked) {
        this.elementTools.move(pos);
      }
    }
  
    handleCanvasRelease(pos) {
      if (this.selectedElement) {
        this.eventManager.emit('element:modified', {
          element: this.selectedElement
        });
      }
    }
  
    // Tool handlers
    handleSelectTool(pos) {
      const element = this.getElementAtPosition(pos);
      this.selectElement(element);
    }
  
    handleMoveTool(pos) {
      if (!this.selectedElement) return;
  
      const dx = pos.x - this.lastPosition.x;
      const dy = pos.y - this.lastPosition.y;
      
      this.selectedElement.move(dx, dy);
      this.lastPosition = pos;
      
      this.eventManager.emit('element:moving', {
        element: this.selectedElement,
        dx,
        dy
      });
    }
  
    getElementAtPosition(pos) {
      // Check layers in reverse order (top to bottom)
      for (let i = this.layerManager.layers.length - 1; i >= 0; i--) {
        const layer = this.layerManager.layers[i];
        if (!layer.visible) continue;
  
        // Check elements in reverse order (newest first)
        for (let j = layer.elements.length - 1; j >= 0; j--) {
          const element = layer.elements[j];
          if (!element.visible) continue;
  
          if (this.isPositionInElement(pos, element)) {
            return element;
          }
        }
      }
      return null;
    }
  
    isPositionInElement(pos, element) {
      switch (element.shape) {
        case 'rect':
          return pos.x >= element.x && 
                 pos.x <= element.x + element.width &&
                 pos.y >= element.y && 
                 pos.y <= element.y + element.height;
        case 'circle':
          const radius = element.width / 2;
          const dx = pos.x - (element.x + radius);
          const dy = pos.y - (element.y + radius);
          return Math.sqrt(dx * dx + dy * dy) <= radius;
        case 'polygon':
          return this.pointInPolygon(pos, element.points);
        default:
          return false;
      }
    }
  
    pointInPolygon(point, polygon) {
      // Ray-casting algorithm
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
  }