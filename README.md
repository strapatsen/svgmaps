# SVG Maps - WebApp

**An SVG-based terrain editor for creating and editing 2D maps with customizable terrain features.**  

![SVG Maps Preview](screenshot_app.png)

## Core Features
- **Zero-dependency** (vanilla JS)
- **Event-driven architecture**
- **Extendable plugin system**
- **Full undo/redo functionality**
- **Multi-layer support**
- **And more...**

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
      canvasId: 'editor-canvas',
      defaultScale: 0.8,
      grid: {
        visible: true,
        size: 50 // pixels
      }
    });
  </script>
</body>
</html>
```

## License  
MIT © 2025 STRAPATSEN 

---
