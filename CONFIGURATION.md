# Terrain Editor Configuration and Usage Guide

This document provides a comprehensive guide to configuring and using the `SVGmaps`. It includes examples, configuration options, and event handling.

---

## Example Configuration with Default Values

```javascript
const editor = new TerrainEditorApp({
  canvasId: 'editor-canvas',
  defaultTool: 'select',
  defaultScale: 1.0,
  defaultUnits: 'meters',
  enableGrid: true,
  grid: {
    size: 50,
    color: 'rgba(0,0,0,0.1)'
  },
  viewport: {
    panEnabled: true,
    zoomEnabled: true,
    maxZoom: 5,
    minZoom: 0.1
  },
  project: {
    name: 'Untitled',
    width: 2000,
    height: 1200
  },
  scale: {
    pixels: 100,
    meters: 1
  },
  enableRulers: true,
  enableMeasurement: true,
  autoSave: true,
  autoSaveInterval: 30000
});
```

---

## Initialization Example

```javascript
const editor = new TerrainEditorApp({
  canvasId: 'main-canvas',
  defaultTool: 'line',
  defaultScale: 0.8,
  grid: {
    size: 25,
    color: 'rgba(255,0,0,0.2)'
  },
  project: {
    name: 'My Terrain Design',
    width: 2500,
    height: 1500
  }
});
```

---

## Adding Custom Event Listeners

```javascript
editor.eventManager.on('tool:changed', tool => {
  console.log(`Tool changed to: ${tool}`);
  statusBar.update(`Active Tool: ${tool}`);
});
```

---

## Registering Custom Tools

```javascript
editor.toolManager.registerTool('star', {
  cursor: 'crosshair',
  handleClick(x, y) {
    editor.elementManager.createElement('polygon', [
      {x, y: y-30},
      {x: x+10, y: y-10},
      {x: x+30, y: y},
      // ...more points
    ]);
  }
});
```

---

## Saving the Project

```javascript
document.getElementById('save-btn').addEventListener('click', () => {
  const data = editor.projectManager.saveProject();
  localStorage.setItem('lastProject', JSON.stringify(data));
});
```

---

## Main Editor Configuration Options

### Configuration Object

```javascript
/**
 * @typedef {Object} EditorConfig
 * @property {string} canvasId - **Required** DOM ID of the canvas element
 * @property {string} [defaultTool='select'] - Initial active tool
 * @property {number} [defaultScale=1.0] - Initial zoom level (0.1 to 10)
 * @property {string} [defaultUnits='meters'] - Base measurement unit
 * @property {boolean} [enableGrid=true] - Show grid by default
 * @property {Object} [grid] - Grid configuration
 * @property {number} [grid.size=50] - Grid cell size in pixels
 * @property {string} [grid.color='rgba(0,0,0,0.1)'] - Grid line color
 * @property {Object} [viewport] - Viewport settings
 * @property {boolean} [viewport.panEnabled=true] - Enable panning
 * @property {boolean} [viewport.zoomEnabled=true] - Enable zooming
 * @property {number} [viewport.maxZoom=5] - Maximum zoom level
 * @property {number} [viewport.minZoom=0.1] - Minimum zoom level
 * @property {Object} [project] - Default project settings
 * @property {string} [project.name='Untitled'] - Initial project name
 * @property {number} [project.width=2000] - Canvas width in pixels
 * @property {number} [project.height=1200] - Canvas height in pixels
 * @property {Object} [scale] - Default scale settings
 * @property {number} [scale.pixels=100] - Pixels per unit
 * @property {number} [scale.meters=1] - Meters per unit
 * @property {boolean} [enableRulers=true] - Show rulers
 * @property {boolean} [enableMeasurement=true] - Enable measurement tools
 * @property {boolean} [autoSave=true] - Enable auto-saving
 * @property {number} [autoSaveInterval=30000] - Auto-save interval in ms
 */
```



---

## Available Tools and Their Options

### Built-in Tools

- **`select`**: Selection tool
- **`line`**: Line drawing tool
- **`rect`**: Rectangle tool
- **`circle`**: Circle tool
- **`polygon`**: Polygon tool
- **`text`**: Text tool
- **`measure`**: Measurement tool
- **`eraser`**: Element eraser

### Custom Tool Example

```javascript
editor.toolManager.registerTool('custom', {
  cursor: 'crosshair',
  activate() {
    console.log('Tool activated');
  },
  deactivate() {
    console.log('Tool deactivated');
  },
  handleClick(x, y) {
    editor.elementManager.createElement('rect', x, y, 100, 100);
  }
});
```

---

## Project Default Structure

### Project Object

```javascript
/**
 * @typedef {Object} Project
 * @property {string} id - Unique project ID
 * @property {string} name - Project name
 * @property {number} width - Canvas width
 * @property {number} height - Canvas height
 * @property {Object} scale - Scale settings
 * @property {number} scale.pixels - Pixels per unit
 * @property {number} scale.meters - Meters per unit
 * @property {string} createdAt - ISO creation timestamp
 * @property {string} lastModified - ISO modification timestamp
 * @property {string} [path] - File path if saved
 * @property {Array} layers - Layer configurations
 * @property {Array} elements - All elements in project
 */
```

### Example Project Data

```javascript
{
  id: 'project-12345',
  name: 'Terrain Design',
  width: 2000,
  height: 1200,
  scale: {
    pixels: 100,
    meters: 1
  },
  createdAt: '2023-07-20T12:00:00Z',
  lastModified: '2023-07-20T14:30:00Z',
  path: '/projects/design1.terrain',
  layers: [...],
  elements: [...]
}
```

---

## Core Events List

### Usage

```javascript
editor.eventManager.on('event:name', callback);
```

### Event Categories

#### Project Events

- **`project:created`**: New project initialized
- **`project:loaded`**: Project loaded from file
- **`project:saved`**: Project saved
- **`project:modified`**: Any project change

#### Element Events

- **`element:created`**: New element added
- **`element:selected`**: Element clicked
- **`element:modified`**: Element properties changed
- **`element:removed`**: Element deleted

#### Tool Events

- **`tool:changed`**: Active tool switched
- **`tool:activated`**: Tool initialized
- **`tool:deactivated`**: Tool cleanup

#### Viewport Events

- **`viewport:zoom`**: Zoom level changed
- **`viewport:pan`**: Viewport panned
- **`viewport:redraw`**: Canvas redrawn

### Example Event Subscriptions

```javascript
editor.eventManager.on('project:loaded', project => {
  console.log(`Loaded project: ${project.name}`);
  document.title = `${project.name} - Terrain Editor`;
});

editor.eventManager.on('element:selected', element => {
  propertiesPanel.show(element);
  console.log('Selected element:', element.type);
});
```

---

This guide provides all the necessary details to get started with `TerrainEditorApp` and customize it for your specific needs.
