class ViewportManager {
    constructor(eventManager) {
      this.eventManager = eventManager;
      this.canvas = document.getElementById('svg-canvas');
      this.tempCanvas = document.getElementById('temp-canvas');
      this.ctx = this.tempCanvas.getContext('2d');
      this.scale = 1.0;
      this.panOffset = { x: 0, y: 0 };
      this.lastPanPosition = { x: 0, y: 0 };
      this.isPanning = false;
      this.gridSize = 40;
      this.showGrid = true;
  
      this.initCanvas();
      this.setupEventListeners();
    }
  
    initCanvas() {
      // Set canvas dimensions
      const width = 1883.42;
      const height = 1003.49;
      
      this.canvas.setAttribute('width', width);
      this.canvas.setAttribute('height', height);
      this.tempCanvas.width = width;
      this.tempCanvas.height = height;
      
      // Initial styles
      this.canvas.style.transformOrigin = '0 0';
      this.updateCanvasTransform();
    }
  
    setupEventListeners() {
      // Mouse events
      this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
      document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
      
      // Touch events
      this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
      document.addEventListener('touchmove', (e) => this.handleTouchMove(e));
      document.addEventListener('touchend', (e) => this.handleTouchEnd(e));
      
      // Zoom
      this.canvas.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
      
      // Keyboard events
      document.addEventListener('keydown', (e) => this.handleKeyDown(e));
      
      // Internal events
      this.eventManager.on('viewport:zoom', (params) => this.zoom(params));
      this.eventManager.on('viewport:pan', (params) => this.pan(params));
      this.eventManager.on('viewport:reset', () => this.resetView());
      this.eventManager.on('grid:toggle', (show) => this.toggleGrid(show));
    }
  
    // Transform methods
    updateCanvasTransform() {
      const transform = `scale(${this.scale}) translate(${this.panOffset.x}px, ${this.panOffset.y}px)`;
      this.canvas.style.transform = transform;
      this.tempCanvas.style.transform = transform;
    }
  
    screenToCanvas(pos) {
      return {
        x: (pos.x - this.panOffset.x) / this.scale,
        y: (pos.y - this.panOffset.y) / this.scale
      };
    }
  
    canvasToScreen(pos) {
      return {
        x: pos.x * this.scale + this.panOffset.x,
        y: pos.y * this.scale + this.panOffset.y
      };
    }
  
    // View manipulation
    zoom({ factor, center }) {
      const oldScale = this.scale;
      this.scale *= factor;
      
      // Limit zoom range
      this.scale = Math.max(0.1, Math.min(10, this.scale));
      
      if (center) {
        // Adjust pan offset to zoom toward mouse position
        this.panOffset.x = center.x - (center.x - this.panOffset.x) * (this.scale / oldScale);
        this.panOffset.y = center.y - (center.y - this.panOffset.y) * (this.scale / oldScale);
      }
      
      this.updateCanvasTransform();
      this.eventManager.emit('viewport:changed', {
        scale: this.scale,
        panOffset: this.panOffset
      });
    }
  
    pan({ dx, dy }) {
      this.panOffset.x += dx;
      this.panOffset.y += dy;
      this.updateCanvasTransform();
      
      this.eventManager.emit('viewport:changed', {
        scale: this.scale,
        panOffset: this.panOffset
      });
    }
  
    resetView() {
      this.scale = 1.0;
      this.panOffset = { x: 0, y: 0 };
      this.updateCanvasTransform();
      
      this.eventManager.emit('viewport:changed', {
        scale: this.scale,
        panOffset: this.panOffset
      });
    }
  
    fitToContent() {
      // Calculate bounding box of all elements
      // Then adjust scale and pan to fit
      // Implementation depends on your content
    }
  
    // Grid methods
    toggleGrid(show) {
      this.showGrid = show !== undefined ? show : !this.showGrid;
      this.drawGrid();
    }
  
    drawGrid() {
      // Clear temp canvas
      this.ctx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
      
      if (!this.showGrid) return;
      
      const scaledGridSize = this.gridSize * this.scale;
      const offsetX = this.panOffset.x % scaledGridSize;
      const offsetY = this.panOffset.y % scaledGridSize;
      
      this.ctx.strokeStyle = '#e0e0e0';
      this.ctx.lineWidth = 1;
      
      // Vertical lines
      for (let x = offsetX; x < this.tempCanvas.width; x += scaledGridSize) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.tempCanvas.height);
        this.ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = offsetY; y < this.tempCanvas.height; y += scaledGridSize) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(this.tempCanvas.width, y);
        this.ctx.stroke();
      }
      
      // Main axes
      this.ctx.strokeStyle = '#888';
      this.ctx.lineWidth = 2;
      
      // X axis
      const originY = -this.panOffset.y / this.scale;
      if (originY >= 0 && originY < this.tempCanvas.height) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, originY);
        this.ctx.lineTo(this.tempCanvas.width, originY);
        this.ctx.stroke();
      }
      
      // Y axis
      const originX = -this.panOffset.x / this.scale;
      if (originX >= 0 && originX < this.tempCanvas.width) {
        this.ctx.beginPath();
        this.ctx.moveTo(originX, 0);
        this.ctx.lineTo(originX, this.tempCanvas.height);
        this.ctx.stroke();
      }
    }
  
    // Event handlers
    handleMouseDown(e) {
      if (e.button === 1 || (e.button === 0 && e.ctrlKey)) { // Middle mouse or Ctrl+Left
        this.isPanning = true;
        this.lastPanPosition = { x: e.clientX, y: e.clientY };
        this.canvas.style.cursor = 'grabbing';
        e.preventDefault();
        return;
      }
      
      const canvasPos = this.screenToCanvas({ x: e.clientX, y: e.clientY });
      this.eventManager.emit('canvas:click', canvasPos);
    }
  
    handleMouseMove(e) {
      if (this.isPanning) {
        const dx = e.clientX - this.lastPanPosition.x;
        const dy = e.clientY - this.lastPanPosition.y;
        
        this.pan({ dx, dy });
        this.lastPanPosition = { x: e.clientX, y: e.clientY };
        e.preventDefault();
        return;
      }
      
      const canvasPos = this.screenToCanvas({ x: e.clientX, y: e.clientY });
      this.eventManager.emit('canvas:drag', canvasPos);
    }
  
    handleMouseUp(e) {
      if (this.isPanning) {
        this.isPanning = false;
        this.canvas.style.cursor = 'default';
        e.preventDefault();
        return;
      }
      
      const canvasPos = this.screenToCanvas({ x: e.clientX, y: e.clientY });
      this.eventManager.emit('canvas:release', canvasPos);
    }
  
    // Similar touch handlers would be implemented...
    handleTouchStart(e) { /* ... */ }
    handleTouchMove(e) { /* ... */ }
    handleTouchEnd(e) { /* ... */ }
  
    handleWheel(e) {
      if (e.ctrlKey) {
        // Zoom
        const rect = this.canvas.getBoundingClientRect();
        const center = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
        
        const factor = e.deltaY < 0 ? 1.1 : 0.9;
        this.zoom({ factor, center });
        e.preventDefault();
      } else {
        // Pan vertically
        this.pan({ dx: 0, dy: -e.deltaY });
      }
    }
  
    handleKeyDown(e) {
      // Pan with arrow keys
      if (e.key.startsWith('Arrow')) {
        const step = 20;
        let dx = 0, dy = 0;
        
        switch (e.key) {
          case 'ArrowUp': dy = -step; break;
          case 'ArrowDown': dy = step; break;
          case 'ArrowLeft': dx = -step; break;
          case 'ArrowRight': dx = step; break;
        }
        
        this.pan({ dx, dy });
        e.preventDefault();
      }
    }
}