// ViewportManager.js
export class ViewportManager {
  constructor(eventManager) {
      this._eventManager = eventManager;
      this._canvas = document.getElementById('svg-canvas');
      this._tempCanvas = document.getElementById('temp-canvas');
      this._ctx = this._tempCanvas.getContext('2d');
      this._scale = 1.0;
      this._panOffset = { x: 0, y: 0 };
      this._lastPanPosition = { x: 0, y: 0 };
      this._isPanning = false;
      this._gridSize = 40;
      this._showGrid = true;
      this._minScale = 0.1;
      this._maxScale = 10;
      this._zoomStep = 0.1;
      this._panStep = 20;

      this._init();
  }

  /* ------------------------ Initialization ------------------------ */

  _init() {
      this._initCanvas();
      this._setupEventListeners();
      this._drawGrid();
  }

  _initCanvas() {
      const width = 1883.42;
      const height = 1003.49;
      
      this._canvas.setAttribute('width', width);
      this._canvas.setAttribute('height', height);
      this._tempCanvas.width = width;
      this._tempCanvas.height = height;
      
      this._canvas.style.transformOrigin = '0 0';
      this._updateCanvasTransform();
  }

  _setupEventListeners() {
      // Mouse events
      this._canvas.addEventListener('mousedown', e => this._handleMouseDown(e));
      document.addEventListener('mousemove', e => this._handleMouseMove(e));
      document.addEventListener('mouseup', e => this._handleMouseUp(e));
      
      // Touch events
      this._canvas.addEventListener('touchstart', e => this._handleTouchStart(e));
      document.addEventListener('touchmove', e => this._handleTouchMove(e));
      document.addEventListener('touchend', e => this._handleTouchEnd(e));
      
      // Wheel/zoom
      this._canvas.addEventListener('wheel', e => this._handleWheel(e), { passive: false });
      
      // Keyboard events
      document.addEventListener('keydown', e => this._handleKeyDown(e));
      
      // Internal events
      this._eventManager.on('viewport:zoom', params => this.zoom(params));
      this._eventManager.on('viewport:pan', params => this.pan(params));
      this._eventManager.on('viewport:reset', () => this.resetView());
      this._eventManager.on('grid:toggle', show => this.toggleGrid(show));
  }

  /* ------------------------ Transform Methods ------------------------ */

  _updateCanvasTransform() {
      const transform = `scale(${this._scale}) translate(${this._panOffset.x}px, ${this._panOffset.y}px)`;
      this._canvas.style.transform = transform;
      this._tempCanvas.style.transform = transform;
      this._drawGrid();
  }

  screenToCanvas(pos) {
      return {
          x: (pos.x - this._panOffset.x) / this._scale,
          y: (pos.y - this._panOffset.y) / this._scale
      };
  }

  canvasToScreen(pos) {
      return {
          x: pos.x * this._scale + this._panOffset.x,
          y: pos.y * this._scale + this._panOffset.y
      };
  }

  /* ------------------------ View Manipulation ------------------------ */

  zoom({ factor = 1.1, center = null }) {
      const oldScale = this._scale;
      this._scale *= factor;
      this._scale = Math.max(this._minScale, Math.min(this._maxScale, this._scale));

      if (center) {
          this._panOffset.x = center.x - (center.x - this._panOffset.x) * (this._scale / oldScale);
          this._panOffset.y = center.y - (center.y - this._panOffset.y) * (this._scale / oldScale);
      }

      this._updateCanvasTransform();
      this._emitViewportChanged();
  }

  pan({ dx = 0, dy = 0 }) {
      this._panOffset.x += dx;
      this._panOffset.y += dy;
      this._updateCanvasTransform();
      this._emitViewportChanged();
  }

  resetView() {
      this._scale = 1.0;
      this._panOffset = { x: 0, y: 0 };
      this._updateCanvasTransform();
      this._emitViewportChanged();
  }

  fitToContent(contentBBox) {
      if (!contentBBox) return;
      
      const canvasWidth = this._canvas.width;
      const canvasHeight = this._canvas.height;
      
      const contentWidth = contentBBox.width;
      const contentHeight = contentBBox.height;
      
      const scaleX = canvasWidth / contentWidth;
      const scaleY = canvasHeight / contentHeight;
      this._scale = Math.min(scaleX, scaleY) * 0.9; // 10% padding
      
      this._panOffset = {
          x: (canvasWidth - contentWidth * this._scale) / 2 - contentBBox.x * this._scale,
          y: (canvasHeight - contentHeight * this._scale) / 2 - contentBBox.y * this._scale
      };
      
      this._updateCanvasTransform();
      this._emitViewportChanged();
  }

  _emitViewportChanged() {
      this._eventManager.emit('viewport:changed', {
          scale: this._scale,
          panOffset: { ...this._panOffset }
      });
  }

  /* ------------------------ Grid Methods ------------------------ */

  toggleGrid(show = null) {
      this._showGrid = show !== null ? show : !this._showGrid;
      this._drawGrid();
  }

  _drawGrid() {
      this._ctx.clearRect(0, 0, this._tempCanvas.width, this._tempCanvas.height);
      if (!this._showGrid) return;

      const scaledGridSize = this._gridSize * this._scale;
      const offsetX = this._panOffset.x % scaledGridSize;
      const offsetY = this._panOffset.y % scaledGridSize;

      // Draw minor grid lines
      this._ctx.strokeStyle = '#e0e0e0';
      this._ctx.lineWidth = 1;
      this._drawGridLines(scaledGridSize, offsetX, offsetY);

      // Draw major axes
      this._ctx.strokeStyle = '#888';
      this._ctx.lineWidth = 2;
      this._drawAxes();
  }

  _drawGridLines(gridSize, offsetX, offsetY) {
      // Vertical lines
      for (let x = offsetX; x < this._tempCanvas.width; x += gridSize) {
          this._ctx.beginPath();
          this._ctx.moveTo(x, 0);
          this._ctx.lineTo(x, this._tempCanvas.height);
          this._ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = offsetY; y < this._tempCanvas.height; y += gridSize) {
          this._ctx.beginPath();
          this._ctx.moveTo(0, y);
          this._ctx.lineTo(this._tempCanvas.width, y);
          this._ctx.stroke();
      }
  }

  _drawAxes() {
      const originY = -this._panOffset.y / this._scale;
      if (originY >= 0 && originY < this._tempCanvas.height) {
          this._ctx.beginPath();
          this._ctx.moveTo(0, originY);
          this._ctx.lineTo(this._tempCanvas.width, originY);
          this._ctx.stroke();
      }
      
      const originX = -this._panOffset.x / this._scale;
      if (originX >= 0 && originX < this._tempCanvas.width) {
          this._ctx.beginPath();
          this._ctx.moveTo(originX, 0);
          this._ctx.lineTo(originX, this._tempCanvas.height);
          this._ctx.stroke();
      }
  }

  /* ------------------------ Event Handlers ------------------------ */

  _handleMouseDown(e) {
      if (this._shouldStartPanning(e)) {
          this._isPanning = true;
          this._lastPanPosition = this._getEventPosition(e);
          this._canvas.style.cursor = 'grabbing';
          e.preventDefault();
          return;
      }
      
      this._emitCanvasEvent('click', e);
  }

  _handleMouseMove(e) {
      if (this._isPanning) {
          const pos = this._getEventPosition(e);
          const dx = pos.x - this._lastPanPosition.x;
          const dy = pos.y - this._lastPanPosition.y;
          
          this.pan({ dx, dy });
          this._lastPanPosition = pos;
          e.preventDefault();
          return;
      }
      
      this._emitCanvasEvent('drag', e);
  }

  _handleMouseUp(e) {
      if (this._isPanning) {
          this._isPanning = false;
          this._canvas.style.cursor = '';
          e.preventDefault();
          return;
      }
      
      this._emitCanvasEvent('release', e);
  }

  _handleTouchStart(e) {
      if (e.touches.length === 2) {
          // Handle pinch zoom
          e.preventDefault();
      } else if (e.touches.length === 1) {
          this._isPanning = true;
          this._lastPanPosition = this._getEventPosition(e.touches[0]);
          e.preventDefault();
      }
  }

  _handleTouchMove(e) {
      if (e.touches.length === 2) {
          // Handle pinch zoom
          e.preventDefault();
      } else if (this._isPanning && e.touches.length === 1) {
          const pos = this._getEventPosition(e.touches[0]);
          const dx = pos.x - this._lastPanPosition.x;
          const dy = pos.y - this._lastPanPosition.y;
          
          this.pan({ dx, dy });
          this._lastPanPosition = pos;
          e.preventDefault();
      }
  }

  _handleTouchEnd(e) {
      if (e.touches.length === 0) {
          this._isPanning = false;
      }
  }

  _handleWheel(e) {
      if (e.ctrlKey) {
          const rect = this._canvas.getBoundingClientRect();
          const center = {
              x: e.clientX - rect.left,
              y: e.clientY - rect.top
          };
          
          const factor = e.deltaY < 0 ? 1 + this._zoomStep : 1 - this._zoomStep;
          this.zoom({ factor, center });
          e.preventDefault();
      } else {
          this.pan({ dx: 0, dy: -e.deltaY });
      }
  }

  _handleKeyDown(e) {
      if (e.key.startsWith('Arrow')) {
          let dx = 0, dy = 0;
          
          switch (e.key) {
              case 'ArrowUp': dy = -this._panStep; break;
              case 'ArrowDown': dy = this._panStep; break;
              case 'ArrowLeft': dx = -this._panStep; break;
              case 'ArrowRight': dx = this._panStep; break;
          }
          
          this.pan({ dx, dy });
          e.preventDefault();
      }
  }

  /* ------------------------ Helper Methods ------------------------ */

  _shouldStartPanning(e) {
      return e.button === 1 || (e.button === 0 && e.ctrlKey);
  }

  _getEventPosition(e) {
      return {
          x: e.clientX,
          y: e.clientY
      };
  }

  _emitCanvasEvent(type, e) {
      const rect = this._canvas.getBoundingClientRect();
      const pos = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
      };
      
      this._eventManager.emit(`canvas:${type}`, this.screenToCanvas(pos));
  }

  /* ------------------------ Public API ------------------------ */

  get scale() {
      return this._scale;
  }

  get panOffset() {
      return { ...this._panOffset };
  }

  get showGrid() {
      return this._showGrid;
  }

  setGridSize(size) {
      this._gridSize = Math.max(5, Math.min(100, size));
      this._drawGrid();
  }
}