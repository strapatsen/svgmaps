// BASE TOOL CLASS (Enhanced)
class Tool {
    constructor(eventManager) {
      this.eventManager = eventManager;
      this.cursor = 'default';
      this.isActive = false;
      this.tempElement = null;
    }
  
    // Lifecycle methods
    activate() {
      this.isActive = true;
    }
    
    // Lifecycle methods
    activate() {
    this.isActive = true;
    }
    
    deactivate() {
    this.isActive = false;
    this.cleanup();
    }

    // Event handlers
    handleStart(x, y, event) {
    this.startX = x;
    this.startY = y;
    this.lastX = x;
    this.lastY = y;
    }

    handleMove(x, y, event) {
    this.lastX = x;
    this.lastY = y;
    }

    handleEnd(x, y, event) {
    this.cleanup();
    }

    handleDoubleClick(x, y, event) {}
    handleKeyDown(event) {}
    
    // Utility methods
    cleanup() {
    if (this.tempElement) {
        this.eventManager.emit('element:remove-temp', this.tempElement.id);
        this.tempElement = null;
    }
    }

    createElement(type, shape, startX, startY, endX, endY, options = {}) {
    const element = new TerrainElement(
        type,
        shape,
        Math.min(startX, endX),
        Math.min(startY, endY),
        {
        width: Math.abs(endX - startX),
        height: Math.abs(endY - startY),
        ...options
        }
    );
    
    this.eventManager.emit('element:create', element);
    return element;
    }

    snapToGrid(x, y) {
    const gridSize = this.eventManager.projectManager.currentProject.gridSize || 10;
    return {
        x: Math.round(x / gridSize) * gridSize,
        y: Math.round(y / gridSize) * gridSize
    };
    }
}

// TOOL IMPLEMENTATIONS
class SelectTool extends Tool {
    constructor(eventManager) {
    super(eventManager);
    this.cursor = 'pointer';
    this.selectionBox = null;
    }

    handleStart(x, y, event) {
    super.handleStart(x, y, event);
    
    if (event.shiftKey) {
        // Multi-select mode
        this.selectionBox = { x1: x, y1: y, x2: x, y2: y };
        this.eventManager.emit('selection:start-box', this.selectionBox);
    } else {
        // Single select
        const element = this.eventManager.elementManager.getElementAt(x, y);
        if (element) {
        this.eventManager.emit('element:select', element);
        } else {
        this.eventManager.emit('element:deselect-all');
        }
    }
    }

    handleMove(x, y, event) {
    super.handleMove(x, y, event);
    
    if (this.selectionBox && event.buttons === 1) {
        this.selectionBox.x2 = x;
        this.selectionBox.y2 = y;
        this.eventManager.emit('selection:update-box', this.selectionBox);
    }
    }

    handleEnd(x, y, event) {
    if (this.selectionBox) {
        const elements = this.eventManager.elementManager.getElementsInArea(
        this.selectionBox.x1, this.selectionBox.y1,
        this.selectionBox.x2, this.selectionBox.y2
        );
        this.eventManager.emit('elements:select-multiple', elements);
        this.selectionBox = null;
        this.eventManager.emit('selection:end-box');
    }
    super.handleEnd(x, y, event);
    }

    cleanup() {
    super.cleanup();
    this.selectionBox = null;
    }
}

class LineTool extends Tool {
    constructor(eventManager) {
    super(eventManager);
    this.cursor = 'crosshair';
    }

    handleStart(x, y, event) {
    super.handleStart(x, y, event);
    const snapped = this.snapToGrid(x, y);
    
    this.tempElement = this.createElement(
        'line', 
        'path',
        snapped.x, snapped.y,
        snapped.x, snapped.y,
        {
        stroke: '#000000',
        strokeWidth: 2,
        isTemp: true
        }
    );
    }

    handleMove(x, y, event) {
    super.handleMove(x, y, event);
    
    if (this.tempElement && event.buttons === 1) {
        const snapped = this.snapToGrid(x, y);
        const start = this.snapToGrid(this.startX, this.startY);
        
        // Update temp element
        this.tempElement.width = Math.abs(snapped.x - start.x);
        this.tempElement.height = Math.abs(snapped.y - start.y);
        this.tempElement.pathData = this.createPathData(start.x, start.y, snapped.x, snapped.y);
        
        this.eventManager.emit('element:update-temp', this.tempElement);
    }
    }

    handleEnd(x, y, event) {
    if (this.tempElement) {
        const snapped = this.snapToGrid(x, y);
        const start = this.snapToGrid(this.startX, this.startY);
        
        if (Math.abs(snapped.x - start.x) > 5 || Math.abs(snapped.y - start.y) > 5) {
        // Create real element
        const element = this.createElement(
            'line',
            'path',
            start.x, start.y,
            snapped.x, snapped.y,
            {
            stroke: '#000000',
            strokeWidth: 2,
            pathData: this.createPathData(start.x, start.y, snapped.x, snapped.y)
            }
        );
        this.eventManager.emit('element:add-to-layer', element);
        }
    }
    super.handleEnd(x, y, event);
    }

    createPathData(x1, y1, x2, y2) {
    return `M${x1},${y1} L${x2},${y2}`;
    }
}

class RectangleTool extends Tool {
    constructor(eventManager) {
    super(eventManager);
    this.cursor = 'crosshair';
    }

    handleStart(x, y, event) {
    super.handleStart(x, y, event);
    const snapped = this.snapToGrid(x, y);
    
    this.tempElement = this.createElement(
        'rectangle',
        'rect',
        snapped.x, snapped.y,
        snapped.x, snapped.y,
        {
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 1,
        isTemp: true
        }
    );
    }

    handleMove(x, y, event) {
    super.handleMove(x, y, event);
    
    if (this.tempElement && event.buttons === 1) {
        const snapped = this.snapToGrid(x, y);
        const start = this.snapToGrid(this.startX, this.startY);
        
        // Update temp element
        this.tempElement.x = Math.min(start.x, snapped.x);
        this.tempElement.y = Math.min(start.y, snapped.y);
        this.tempElement.width = Math.abs(snapped.x - start.x);
        this.tempElement.height = Math.abs(snapped.y - start.y);
        
        this.eventManager.emit('element:update-temp', this.tempElement);
    }
    }

    handleEnd(x, y, event) {
    if (this.tempElement) {
        const snapped = this.snapToGrid(x, y);
        const start = this.snapToGrid(this.startX, this.startY);
        
        if (Math.abs(snapped.x - start.x) > 5 && Math.abs(snapped.y - start.y) > 5) {
        // Create real element
        const element = this.createElement(
            'rectangle',
            'rect',
            Math.min(start.x, snapped.x),
            Math.min(start.y, snapped.y),
            Math.abs(snapped.x - start.x),
            Math.abs(snapped.y - start.y),
            {
            fill: '#ffffff',
            stroke: '#000000',
            strokeWidth: 1
            }
        );
        this.eventManager.emit('element:add-to-layer', element);
        }
    }
    super.handleEnd(x, y, event);
    }
}

class CircleTool extends Tool {
    constructor(eventManager) {
    super(eventManager);
    this.cursor = 'crosshair';
    }

    handleStart(x, y, event) {
    super.handleStart(x, y, event);
    const snapped = this.snapToGrid(x, y);
    
    this.tempElement = this.createElement(
        'circle',
        'ellipse',
        snapped.x, snapped.y,
        snapped.x, snapped.y,
        {
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 1,
        isTemp: true
        }
    );
    }

    handleMove(x, y, event) {
    super.handleMove(x, y, event);
    
    if (this.tempElement && event.buttons === 1) {
        const snapped = this.snapToGrid(x, y);
        const radius = Math.sqrt(
        Math.pow(snapped.x - this.startX, 2) + 
        Math.pow(snapped.y - this.startY, 2)
        );
        
        // Update temp element
        this.tempElement.width = radius * 2;
        this.tempElement.height = radius * 2;
        this.tempElement.x = this.startX - radius;
        this.tempElement.y = this.startY - radius;
        
        this.eventManager.emit('element:update-temp', this.tempElement);
    }
    }

    handleEnd(x, y, event) {
    if (this.tempElement) {
        const snapped = this.snapToGrid(x, y);
        const radius = Math.sqrt(
        Math.pow(snapped.x - this.startX, 2) + 
        Math.pow(snapped.y - this.startY, 2)
        );
        
        if (radius > 5) {
        // Create real element
        const element = this.createElement(
            'circle',
            'ellipse',
            this.startX - radius,
            this.startY - radius,
            radius * 2,
            radius * 2,
            {
            fill: '#ffffff',
            stroke: '#000000',
            strokeWidth: 1
            }
        );
        this.eventManager.emit('element:add-to-layer', element);
        }
    }
    super.handleEnd(x, y, event);
    }
}

class PolygonTool extends Tool {
    constructor(eventManager) {
    super(eventManager);
    this.cursor = 'crosshair';
    this.points = [];
    this.isCreating = false;
    }

    handleStart(x, y, event) {
    super.handleStart(x, y, event);
    const snapped = this.snapToGrid(x, y);
    
    if (!this.isCreating) {
        // Start new polygon
        this.isCreating = true;
        this.points = [{ x: snapped.x, y: snapped.y }];
        
        this.tempElement = this.createElement(
        'polygon',
        'path',
        snapped.x, snapped.y,
        snapped.x, snapped.y,
        {
            fill: '#ffffff',
            stroke: '#000000',
            strokeWidth: 1,
            isTemp: true,
            points: this.points
        }
        );
    } else {
        // Add point to existing polygon
        this.points.push({ x: snapped.x, y: snapped.y });
        this.updatePolygonPath();
    }
    }

    handleDoubleClick(x, y, event) {
    if (this.isCreating && this.points.length >= 3) {
        // Finish polygon
        const element = this.createElement(
        'polygon',
        'path',
        0, 0, // Actual position calculated from points
        0, 0,
        {
            fill: '#ffffff',
            stroke: '#000000',
            strokeWidth: 1,
            points: this.points,
            pathData: this.createPathData()
        }
        );
        
        // Calculate bounding box
        const bbox = this.calculateBoundingBox();
        element.x = bbox.x;
        element.y = bbox.y;
        element.width = bbox.width;
        element.height = bbox.height;
        
        this.eventManager.emit('element:add-to-layer', element);
        
        // Reset tool
        this.cleanup();
    }
    }

    handleMove(x, y, event) {
    super.handleMove(x, y, event);
    
    if (this.isCreating && this.points.length > 0) {
        const snapped = this.snapToGrid(x, y);
        this.tempPoints = [...this.points, { x: snapped.x, y: snapped.y }];
        this.updatePolygonPath();
    }
    }

    updatePolygonPath() {
    if (this.tempElement && this.tempPoints) {
        this.tempElement.pathData = this.createPathData(this.tempPoints);
        this.eventManager.emit('element:update-temp', this.tempElement);
    }
    }

    createPathData(points = this.points) {
    if (points.length === 0) return '';
    return `M${points[0].x},${points[0].y} ` + 
            points.slice(1).map(p => `L${p.x},${p.y}`).join(' ') + 
            (points.length > 2 ? ' Z' : '');
    }

    calculateBoundingBox() {
    if (this.points.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
    
    const xs = this.points.map(p => p.x);
    const ys = this.points.map(p => p.y);
    
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    
    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
    };
    }

    cleanup() {
    super.cleanup();
    this.points = [];
    this.isCreating = false;
    this.tempPoints = null;
    }

    handleKeyDown(event) {
    if (event.key === 'Escape' && this.isCreating) {
        this.cleanup();
        this.eventManager.emit('tool:cancel-current');
    }
    }
}

class TextTool extends Tool {
    constructor(eventManager) {
    super(eventManager);
    this.cursor = 'text';
    }

    handleStart(x, y, event) {
    super.handleStart(x, y, event);
    
    // Create text input element at position
    this.textInput = document.createElement('div');
    this.textInput.contentEditable = true;
    this.textInput.style.position = 'absolute';
    this.textInput.style.left = `${x}px`;
    this.textInput.style.top = `${y}px`;
    this.textInput.style.minWidth = '100px';
    this.textInput.style.border = '1px dashed #000';
    this.textInput.style.padding = '2px';
    this.textInput.style.outline = 'none';
    this.textInput.style.backgroundColor = 'white';
    
    document.getElementById('canvas-container').appendChild(this.textInput);
    this.textInput.focus();
    
    this.textInput.addEventListener('blur', () => this.finalizeText());
    this.textInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.finalizeText();
        } else if (e.key === 'Escape') {
        this.cancelText();
        }
    });
    }

    finalizeText() {
    if (this.textInput && this.textInput.textContent.trim()) {
        const rect = this.textInput.getBoundingClientRect();
        const canvasRect = document.getElementById('main-canvas').getBoundingClientRect();
        
        const element = new TerrainElement(
        'text',
        'text',
        rect.left - canvasRect.left,
        rect.top - canvasRect.top,
        {
            width: rect.width,
            height: rect.height,
            text: this.textInput.textContent,
            color: '#000000',
            fontSize: 12,
            fontFamily: 'Arial'
        }
        );
        
        this.eventManager.emit('element:add-to-layer', element);
    }
    
    this.cleanup();
    }

    cancelText() {
    this.cleanup();
    }

    cleanup() {
    super.cleanup();
    if (this.textInput) {
        this.textInput.remove();
        this.textInput = null;
    }
    }
}

class MeasureTool extends Tool {
    constructor(eventManager) {
    super(eventManager);
    this.cursor = 'crosshair';
    this.measurements = [];
    this.currentMeasurement = null;
    }

    handleStart(x, y, event) {
    super.handleStart(x, y, event);
    const snapped = this.snapToGrid(x, y);
    
    if (!this.currentMeasurement) {
        // Start new measurement
        this.currentMeasurement = {
        points: [snapped],
        distances: [],
        totalLength: 0
        };
        
        this.tempElement = this.createElement(
        'measurement',
        'path',
        snapped.x, snapped.y,
        snapped.x, snapped.y,
        {
            stroke: '#ff0000',
            strokeWidth: 1,
            isTemp: true,
            dashArray: [5, 3],
            showMeasurement: true
        }
        );
    } else {
        // Add point to current measurement
        const lastPoint = this.currentMeasurement.points[this.currentMeasurement.points.length - 1];
        const distance = Math.sqrt(Math.pow(snapped.x - lastPoint.x, 2) + Math.pow(snapped.y - lastPoint.y, 2));
        
        this.currentMeasurement.points.push(snapped);
        this.currentMeasurement.distances.push(distance);
        this.currentMeasurement.totalLength += distance;
        
        this.updateMeasurementPath();
    }
    }

    handleDoubleClick(x, y, event) {
    if (this.currentMeasurement && this.currentMeasurement.points.length >= 2) {
        // Finalize measurement
        this.measurements.push(this.currentMeasurement);
        this.eventManager.emit('measurement:add', this.currentMeasurement);
        this.cleanup();
    }
    }

    handleMove(x, y, event) {
    super.handleMove(x, y, event);
    
    if (this.currentMeasurement && this.currentMeasurement.points.length > 0) {
        const snapped = this.snapToGrid(x, y);
        this.tempPoints = [...this.currentMeasurement.points, snapped];
        this.updateMeasurementPath();
    }
    }

    updateMeasurementPath() {
    if (this.tempElement && this.tempPoints) {
        this.tempElement.pathData = this.createPathData(this.tempPoints);
        
        // Calculate temporary distance
        if (this.tempPoints.length >= 2) {
        const lastFixed = this.currentMeasurement.points[this.currentMeasurement.points.length - 1];
        const currentTemp = this.tempPoints[this.tempPoints.length - 1];
        const tempDistance = Math.sqrt(
            Math.pow(currentTemp.x - lastFixed.x, 2) + 
            Math.pow(currentTemp.y - lastFixed.y, 2)
        );
        
        this.tempElement.measurementText = `Total: ${this.currentMeasurement.totalLength.toFixed(2)} (+${tempDistance.toFixed(2)})`;
        }
        
        this.eventManager.emit('element:update-temp', this.tempElement);
    }
    }

    createPathData(points) {
    if (points.length === 0) return '';
    return `M${points[0].x},${points[0].y} ` + 
            points.slice(1).map(p => `L${p.x},${p.y}`).join(' ');
    }

    cleanup() {
    super.cleanup();
    this.currentMeasurement = null;
    this.tempPoints = null;
    }

    handleKeyDown(event) {
    if (event.key === 'Escape' && this.currentMeasurement) {
        this.cleanup();
        this.eventManager.emit('tool:cancel-current');
    }
    }
}

class EraserTool extends Tool {
    constructor(eventManager) {
    super(eventManager);
    this.cursor = 'url("eraser-cursor.png") 0 16, auto';
    this.erasing = false;
    this.erasedElements = [];
    }

    handleStart(x, y, event) {
    super.handleStart(x, y, event);
    this.erasing = true;
    this.eraseAt(x, y);
    }

    handleMove(x, y, event) {
    super.handleMove(x, y, event);
    if (this.erasing && event.buttons === 1) {
        this.eraseAt(x, y);
    }
    }

    handleEnd(x, y, event) {
    super.handleEnd(x, y, event);
    this.erasing = false;
    
    if (this.erasedElements.length > 0) {
        this.eventManager.emit('elements:remove', this.erasedElements);
        this.erasedElements = [];
    }
    }

    eraseAt(x, y) {
    const element = this.eventManager.elementManager.getElementAt(x, y);
    if (element && !this.erasedElements.includes(element)) {
        this.erasedElements.push(element);
        this.eventManager.emit('element:hide-temp', element.id);
    }
    }
}

class PaintTool extends Tool {
    constructor(eventManager) {
    super(eventManager);
    this.cursor = 'url("paint-bucket.png") 0 16, auto';
    this.currentColor = '#000000';
    this.currentFill = '#ffffff';
    }

    handleStart(x, y, event) {
    super.handleStart(x, y, event);
    const element = this.eventManager.elementManager.getElementAt(x, y);
    
    if (element) {
        const newElement = { ...element };
        
        if (event.altKey) {
        // Pick color from element
        this.currentColor = element.stroke || this.currentColor;
        this.currentFill = element.fill || this.currentFill;
        this.eventManager.emit('tool:color-changed', {
            stroke: this.currentColor,
            fill: this.currentFill
        });
        } else if (event.shiftKey) {
        // Apply fill
        newElement.fill = this.currentFill;
        } else {
        // Apply stroke
        newElement.stroke = this.currentColor;
        }
        
        this.eventManager.emit('element:update', {
        id: element.id,
        updates: newElement
        });
    }
    }

    setColor(color, isFill = false) {
    if (isFill) {
        this.currentFill = color;
    } else {
        this.currentColor = color;
    }
    }
}

class PolygonShapeTool extends Tool {
    constructor(eventManager, sides) {
      super(eventManager);
      this.cursor = 'crosshair';
      this.sides = sides;
    }
  
    handleStart(x, y, event) {
      super.handleStart(x, y, event);
      const snapped = this.snapToGrid(x, y);
      this.tempElement = this.createElement(
        `polygon-${this.sides}`,
        'polygon',
        snapped.x,
        snapped.y,
        snapped.x,
        snapped.y,
        {
          stroke: '#000000',
          strokeWidth: 1,
          fill: '#ffffff',
          isTemp: true
        }
      );
    }
  
    handleMove(x, y, event) {
      super.handleMove(x, y, event);
      if (this.tempElement && event.buttons === 1) {
        const center = this.snapToGrid(this.startX, this.startY);
        const edge = this.snapToGrid(x, y);
        const radius = Math.sqrt(
          Math.pow(edge.x - center.x, 2) +
          Math.pow(edge.y - center.y, 2)
        );
        const points = [];
        for (let i = 0; i < this.sides; i++) {
          const angle = (2 * Math.PI * i) / this.sides - Math.PI / 2;
          const px = center.x + radius * Math.cos(angle);
          const py = center.y + radius * Math.sin(angle);
          points.push(`${px},${py}`);
        }
        this.tempElement.points = points.join(' ');
        this.tempElement.x = center.x - radius;
        this.tempElement.y = center.y - radius;
        this.tempElement.width = radius * 2;
        this.tempElement.height = radius * 2;
        this.eventManager.emit('element:update-temp', this.tempElement);
      }
    }
  
    handleEnd(x, y, event) {
      if (this.tempElement && this.tempElement.points) {
        const element = this.createElement(
          `polygon-${this.sides}`,
          'polygon',
          this.tempElement.x,
          this.tempElement.y,
          this.tempElement.width,
          this.tempElement.height,
          {
            points: this.tempElement.points,
            stroke: '#000000',
            strokeWidth: 1,
            fill: '#ffffff'
          }
        );
        this.eventManager.emit('element:add-to-layer', element);
      }
      super.handleEnd(x, y, event);
    }
}
  
class ExternalSVGTool extends Tool {
    constructor(eventManager, urlProvider) {
      super(eventManager);
      this.cursor = 'crosshair';
      this.urlProvider = urlProvider;
    }
  
    async handleStart(x, y, event) {
      super.handleStart(x, y, event);
      const snapped = this.snapToGrid(x, y);
      const url = await this.urlProvider();
      if (!url) return;
      fetch(url)
        .then(res => res.text())
        .then(svgText => {
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
          const svgElement = svgDoc.documentElement;
          const wrapper = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          wrapper.innerHTML = svgElement.innerHTML;
          const element = this.createElement(
            'external-svg',
            'g',
            snapped.x,
            snapped.y,
            100,
            100,
            {
              raw: wrapper.innerHTML,
              stroke: 'none',
              fill: 'none'
            }
          );
          this.eventManager.emit('element:add-to-layer', element);
        });
    }
}

class StarTool extends Tool {

    constructor(eventManager, points) {
    super(eventManager);
    this.cursor = 'crosshair';
    this.pointsCount = points;
    }

    handleStart(x, y, event) {
    super.handleStart(x, y, event);
    const snapped = this.snapToGrid(x, y);
    this.tempElement = this.createElement(
        'star',
        'polygon',
        snapped.x,
        snapped.y,
        snapped.x,
        snapped.y,
        {
        stroke: '#000000',
        strokeWidth: 1,
        fill: '#ffffff',
        isTemp: true
        }
    );
    }

    handleMove(x, y, event) {
    super.handleMove(x, y, event);
    if (this.tempElement && event.buttons === 1) {
        const cx = this.startX;
        const cy = this.startY;
        const outerR = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
        const innerR = outerR / 2.5;
        const points = [];
        for (let i = 0; i < this.pointsCount * 2; i++) {
        const angle = (Math.PI / this.pointsCount) * i - Math.PI / 2;
        const r = i % 2 === 0 ? outerR : innerR;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        points.push(`${px},${py}`);
        }
        this.tempElement.points = points.join(' ');
        this.tempElement.x = cx - outerR;
        this.tempElement.y = cy - outerR;
        this.tempElement.width = outerR * 2;
        this.tempElement.height = outerR * 2;
        this.eventManager.emit('element:update-temp', this.tempElement);
    }
    }

    handleEnd(x, y, event) {
    if (this.tempElement && this.tempElement.points) {
        const element = this.createElement(
        'star',
        'polygon',
        this.tempElement.x,
        this.tempElement.y,
        this.tempElement.width,
        this.tempElement.height,
        {
            points: this.tempElement.points,
            stroke: '#000000',
            strokeWidth: 1,
            fill: '#ffffff'
        }
        );
        this.eventManager.emit('element:add-to-layer', element);
    }
    super.handleEnd(x, y, event);
    }

}

class ColorTool {
    constructor(root) {
     this.root = root
     this.mode = 'solid'
     this.color = '#000000'
     this.gradientStops = [{ color: '#000000', position: 0 }, { color: '#ffffff', position: 100 }]
     this.pattern = ''
    }
   
    setMode(mode) {
     this.mode = mode
    }
   
    setColor(value) {
     this.color = value
    }
   
    setGradientStops(stops) {
     this.gradientStops = stops
    }
   
    setPattern(url) {
     this.pattern = url
    }
   
    getValue() {
     if (this.mode === 'solid') return this.color
     if (this.mode === 'linear') return `linear-gradient(${this.gradientStops.map(s => `${s.color} ${s.position}%`).join(', ')})`
     if (this.mode === 'radial') return `radial-gradient(${this.gradientStops.map(s => `${s.color} ${s.position}%`).join(', ')})`
     if (this.mode === 'pattern') return `url(${this.pattern})`
     return null
    }
}

class GroupTool {
    constructor() {
     this.groups = []
    }
   
    group(elements) {
     const group = { id: crypto.randomUUID(), elements: [...elements] }
     this.groups.push(group)
     return group
    }
   
    ungroup(groupId) {
     const index = this.groups.findIndex(g => g.id === groupId)
     if (index > -1) {
      const elements = this.groups[index].elements
      this.groups.splice(index, 1)
      return elements
     }
     return []
    }
}

// Register Tools
const tools = {
    triangle: (em) => new PolygonShapeTool(em, 3),
    pentagon: (em) => new PolygonShapeTool(em, 5),
    hexagon: (em) => new PolygonShapeTool(em, 6),
    star: (em) => new StarTool(em, 5),
    externalSvg: (em) => new ExternalSVGTool(em, async () => prompt("Voer URL naar SVG-bestand in:")),
    rectangle: (em) => new RectangleTool(em),
    circle: (em) => new CircleTool(em),
    line: (em) => new LineTool(em),
    polygon: (em) => new PolygonTool(em),
    text: (em) => new TextTool(em),
    measure: (em) => new MeasureTool(em),
    select: (em) => new SelectTool(em),
    eraser: (em) => new EraserTool(em),
    paint: (em) => new PaintTool(em),
    color: (em) => new ColorTool(em),
    gradient: (em) => new ColorTool(em),
    pattern: (em) => new ColorTool(em),
    group: (em) => new GroupTool(em),
    ungroup: (em) => new GroupTool(em),
};