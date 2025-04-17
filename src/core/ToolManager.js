// ToolManager.js

import { tools as baseTools } from './tools/toolRegistry.js';
import { pluginTools } from '../plugins/';

const allTools = {
    ...baseTools,
    ...pluginTools
};

export class ToolManager {

  constructor(eventManager) {
      this._eventManager = eventManager;
      this._currentTool = 'select';
      this._toolState = new Map(); // Voor tool-specifieke state
      this._tools = this._initializeTools();
      this._canvas = document.getElementById('main-canvas');
      this._tools = {};
      for (const [name, factory] of Object.entries(allTools)) {
          this._tools[name] = factory(eventManager);
      }
      this._init();
  }
  
  /* ------------------------ Initialization ------------------------ */

  _initializeTools() {
      return {
          select: new SelectTool(this._eventManager),
          line: new LineTool(this._eventManager),
          rect: new RectangleTool(this._eventManager),
          circle: new CircleTool(this._eventManager),
          polygon: new PolygonTool(this._eventManager),
          text: new TextTool(this._eventManager),
          measure: new MeasureTool(this._eventManager),
          eraser: new EraserTool(this._eventManager),
          paint: new PaintTool(this._eventManager)
      };
  }

  _init() {
      this._setupMouseEventListeners();
      this._setupTouchEventListeners();
      this._setupKeyboardEventListeners();
      this._setupToolEvents();
      this._updateCursor();
  }

  /* ------------------------ Event Listeners ------------------------ */

  _setupMouseEventListeners() {
      this._canvas.addEventListener('mousedown', e => this._handleToolEvent('handleStart', e));
      this._canvas.addEventListener('mousemove', e => this._handleToolEvent('handleMove', e));
      this._canvas.addEventListener('mouseup', e => this._handleToolEvent('handleEnd', e));
      this._canvas.addEventListener('dblclick', e => this._handleToolEvent('handleDoubleClick', e));
      this._canvas.addEventListener('mouseleave', e => this._handleToolEvent('handleCancel', e));
  }

  _setupTouchEventListeners() {
      this._canvas.addEventListener('touchstart', e => {
          e.preventDefault();
          this._handleToolEvent('handleStart', e.touches[0]);
      });
      
      this._canvas.addEventListener('touchmove', e => {
          e.preventDefault();
          this._handleToolEvent('handleMove', e.touches[0]);
      });
      
      this._canvas.addEventListener('touchend', e => {
          e.preventDefault();
          this._handleToolEvent('handleEnd', e.changedTouches[0]);
      });
  }

  _setupKeyboardEventListeners() {
      document.addEventListener('keydown', e => {
          // Eerst doorgeven aan huidige tool
          this._getCurrentTool()?.handleKeyDown?.(e);
          
          // Tool switching shortcuts (alleen als geen modifier keys)
          if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
              this._handleToolShortcut(e.key.toLowerCase());
          }
      });
  }

  _setupToolEvents() {
      this._eventManager.on('viewport:changed', () => this._updateCursor());
  }

  /* ------------------------ Tool Handling ------------------------ */

  _handleToolEvent(method, event) {
      const pos = this._getCanvasCoordinates(event);
      const tool = this._getCurrentTool();
      
      if (tool && tool[method]) {
          tool[method](pos.x, pos.y, event);
          this._eventManager.emit(`tool:${method.replace('handle', '').toLowerCase()}`, { 
              tool: this._currentTool, 
              x: pos.x, 
              y: pos.y 
          });
      }
  }

  _handleToolShortcut(key) {
      const shortcuts = {
          'v': 'select',
          'l': 'line',
          'r': 'rect',
          'c': 'circle',
          'p': 'polygon',
          't': 'text',
          'm': 'measure',
          'e': 'eraser',
          'b': 'paint'
      };
      
      if (shortcuts[key]) {
          this.setTool(shortcuts[key]);
      }
  }

  /* ------------------------ Public API ------------------------ */

  getTool(name) {
    return this._tools[name];
  }

  setTool(toolName) {
      if (!this._tools[toolName]) return false;

      // Deactivate previous tool
      const previousTool = this._getCurrentTool();
      if (previousTool?.deactivate) {
          previousTool.deactivate();
      }

      // Activate new tool
      this._currentTool = toolName;
      const newTool = this._getCurrentTool();
      if (newTool?.activate) {
          newTool.activate();
      }

      this._eventManager.emit('tool:changed', {
          previousTool: previousTool?.name,
          currentTool: toolName
      });

      this._updateCursor();
      return true;
  }

  getToolState(toolName) {
      if (!this._toolState.has(toolName)) {
          this._toolState.set(toolName, {});
      }
      return this._toolState.get(toolName);
  }

  updateToolState(toolName, state) {
      this._toolState.set(toolName, { 
          ...this.getToolState(toolName), 
          ...state 
      });
  }

  /* ------------------------ Coordinate Conversion ------------------------ */

  _getCanvasCoordinates(inputEvent) {
      const rect = this._canvas.getBoundingClientRect();
      const viewport = this._eventManager.viewportManager;
      
      return {
          x: (inputEvent.clientX - rect.left - viewport.panOffset.x) / viewport.scale,
          y: (inputEvent.clientY - rect.top - viewport.panOffset.y) / viewport.scale
      };
  }

  /* ------------------------ Helper Methods ------------------------ */

  _getCurrentTool() {
      return this._tools[this._currentTool];
  }

  _updateCursor() {
      const tool = this._getCurrentTool();
      this._canvas.style.cursor = tool?.cursor || 'default';
  }

  /* ------------------------ Getters ------------------------ */

  get currentTool() {
      return this._currentTool;
  }

  get tools() {
      return { ...this._tools }; // Return copy
  }
}

/* ------------------------ Base Tool ------------------------ */

class BaseTool {
  constructor(eventManager, name) {
      this._eventManager = eventManager;
      this.name = name;
      this.cursor = 'default';
  }

  activate() {}
  deactivate() {}
  handleStart(x, y, event) {}
  handleMove(x, y, event) {}
  handleEnd(x, y, event) {}
  handleDoubleClick(x, y, event) {}
  handleCancel() {}
  handleKeyDown(event) {}
  handleKeyUp(event) {}
  handleMouseWheel(event) {}
}



