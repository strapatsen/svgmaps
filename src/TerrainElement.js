class TerrainElement {
    static nextId = 1;
    
    constructor(type, shape, options = {}) {
      this.id = `element-${TerrainElement.nextId++}`;
      this.type = type;
      this.shape = shape;
      this.x = options.x || 0;
      this.y = options.y || 0;
      this.width = options.width || 0;
      this.height = options.height || 0;
      this.rotation = options.rotation || 0;
      this.color = options.color || this.getDefaultColor(type);
      this.name = options.name || '';
      this.visible = options.visible !== false;
      this.locked = options.locked || false;
      this.layerId = options.layerId || null;
      this.metadata = options.metadata || {};
      this.points = options.points || this.getDefaultPoints();
    }
  
    getDefaultPoints() {
      switch (this.shape) {
        case 'rect':
          return [
            { x: this.x, y: this.y, id: 'p1' },
            { x: this.x + this.width, y: this.y, id: 'p2' },
            { x: this.x + this.width, y: this.y + this.height, id: 'p3' },
            { x: this.x, y: this.y + this.height, id: 'p4' }
          ];
        case 'circle':
          return [
            { x: this.x, y: this.y, id: 'center' }
          ];
        case 'line':
          return [
            { x: this.x, y: this.y, id: 'start' },
            { x: this.x + this.width, y: this.y + this.height, id: 'end' }
          ];
        default:
          return [];
      }
    }
  
    getDefaultColor(type) {
      const colors = {
        'power-point': '#FF0000',
        'water-pipe': '#0000FF',
        'text': '#000000',
        'default': '#888888'
      };
      return colors[type] || colors.default;
    }
  
    move(dx, dy) {
      if (this.locked) return false;
      
      this.x += dx;
      this.y += dy;
      
      // Update all points if they exist
      if (this.points) {
        this.points.forEach(point => {
          point.x += dx;
          point.y += dy;
        });
      }
      
      return true;
    }
  
    resize(newWidth, newHeight, anchor = 'top-left') {
      if (this.locked) return false;
      
      // Implement different anchor points
    switch (anchor) {
      case 'top-left':
        this.width = newWidth;
        this.height = newHeight;
        break;
      case 'center':
        const dx = (newWidth - this.width) / 2;
        const dy = (newHeight - this.height) / 2;
        this.x -= dx;
        this.y -= dy;
        this.width = newWidth;
        this.height = newHeight;
        break;
      case 'top-right':
        this.x -= (newWidth - this.width);
        this.width = newWidth;
        this.height = newHeight;
        break;
      case 'bottom-left':
        this.y -= (newHeight - this.height);
        this.width = newWidth;
        this.height = newHeight;
        break;
      case 'bottom-right':
        this.x -= (newWidth - this.width);
        this.y -= (newHeight - this.height);
        this.width = newWidth;
        this.height = newHeight;
        break;
      default:
        throw new Error(`Unsupported anchor point: ${anchor}`);
    }
      
      return true;
    }
  
    toJSON() {
      return {
        id: this.id,
        type: this.type,
        shape: this.shape,
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        rotation: this.rotation,
        color: this.color,
        name: this.name,
        visible: this.visible,
        locked: this.locked,
        layerId: this.layerId,
        points: this.points,
        metadata: this.metadata
      };
    }
  
    static fromJSON(json) {
      return new TerrainElement(json.type, json.shape, {
        id: json.id,
        x: json.x,
        y: json.y,
        width: json.width,
        height: json.height,
        rotation: json.rotation,
        color: json.color,
        name: json.name,
        visible: json.visible,
        locked: json.locked,
        layerId: json.layerId,
        points: json.points,
        metadata: json.metadata
      });
    }
}