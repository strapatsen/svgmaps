# SVG Maps - WebApp

**An SVG-based terrain editor for creating and editing 2D maps with customizable terrain features.**  

![SVG Maps Preview](screenshot_app.png)

## Core Features
- **Zero-dependency** vanilla JS implementation
- **Event-driven architecture**
- **Extendable plugin system**
- **Full undo/redo functionality**
- **Multi-layer support**

## Basic Setup

```html
<!DOCTYPE html>
<html>
<head>
  <title>Terrain Editor</title>
  <style>
    #editor-container { width: 100%; height: 100vh; }
  </style>
</head>
<body>
  <div id="editor-container">
    <canvas id="main-canvas"></canvas>
  </div>
  
  <script src="terrain-editor.js"></script>
  <script>
    const editor = new TerrainEditorApp({
      canvasId: 'main-canvas',
      defaultUnits: 'meters'
    });
  </script>
</body>
</html>
```

## License  
MIT © 2025 STRAPATSEN 

---
