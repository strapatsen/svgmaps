
class ToolManager {
    constructor(eventManager) {
      this.eventManager = eventManager;
      this.currentTool = 'select';
      this.toolState = {}; // Voor tool-specifieke state
      this.tools = {
        select: new SelectTool(eventManager),
        line: new LineTool(eventManager),
        rect: new RectangleTool(eventManager),
        circle: new CircleTool(eventManager),
        polygon: new PolygonTool(eventManager),
        text: new TextTool(eventManager),
        measure: new MeasureTool(eventManager),
        eraser: new EraserTool(eventManager),
        paint: new PaintTool(eventManager)
      };
  
      this.init();
    }
  
    init() {
      // Canvas event listeners
      const canvas = document.getElementById('main-canvas');
      
      canvas.addEventListener('mousedown', (e) => {
        const pos = this.getCanvasCoordinates(e);
        this.tools[this.currentTool].handleStart(pos.x, pos.y, e);
        this.eventManager.emit('tool:start', { tool: this.currentTool, x: pos.x, y: pos.y });
      });
  
      canvas.addEventListener('mousemove', (e) => {
        const pos = this.getCanvasCoordinates(e);
        this.tools[this.currentTool].handleMove(pos.x, pos.y, e);
        this.eventManager.emit('tool:move', { tool: this.currentTool, x: pos.x, y: pos.y });
      });
  
      canvas.addEventListener('mouseup', (e) => {
        const pos = this.getCanvasCoordinates(e);
        this.tools[this.currentTool].handleEnd(pos.x, pos.y, e);
        this.eventManager.emit('tool:end', { tool: this.currentTool, x: pos.x, y: pos.y });
      });
  
      canvas.addEventListener('dblclick', (e) => {
        const pos = this.getCanvasCoordinates(e);
        this.tools[this.currentTool].handleDoubleClick(pos.x, pos.y, e);
      });
  
      // Touch support
      canvas.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const pos = this.getCanvasCoordinates(touch);
        this.tools[this.currentTool].handleStart(pos.x, pos.y, e);
      });
  
      // Keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        this.tools[this.currentTool].handleKeyDown(e);
        
        // Tool switching shortcuts
        if (e.ctrlKey || e.metaKey) return;
        switch (e.key) {
          case 'v': this.setTool('select'); break;
          case 'l': this.setTool('line'); break;
          case 'r': this.setTool('rect'); break;
          case 'c': this.setTool('circle'); break;
          case 'p': this.setTool('polygon'); break;
          case 't': this.setTool('text'); break;
          case 'm': this.setTool('measure'); break;
          case 'e': this.setTool('eraser'); break;
        }
      });
    }
  
    setTool(toolName) {
      if (this.tools[toolName]) {
        // Clean up previous tool
        if (this.tools[this.currentTool].deactivate) {
          this.tools[this.currentTool].deactivate();
        }
        
        this.currentTool = toolName;
        
        // Activate new tool
        if (this.tools[toolName].activate) {
          this.tools[toolName].activate();
        }
        
        this.eventManager.emit('tool:changed', toolName);
        this.updateCursor();
      }
    }
  
    getCanvasCoordinates(inputEvent) {
      const canvas = document.getElementById('main-canvas');
      const rect = canvas.getBoundingClientRect();
      const scale = this.eventManager.viewportManager.currentScale;
      const pan = this.eventManager.viewportManager.panOffset;
      
      return {
        x: (inputEvent.clientX - rect.left - pan.x) / scale,
        y: (inputEvent.clientY - rect.top - pan.y) / scale
      };
    }
  
    updateCursor() {
      const canvas = document.getElementById('main-canvas');
      canvas.style.cursor = this.tools[this.currentTool].cursor || 'default';
    }
  
    getCurrentTool() {
      return this.tools[this.currentTool];
    }
}

