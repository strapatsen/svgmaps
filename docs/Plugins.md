# Plugin Development Guide

## Plugin Structure

```javascript
/**
 * Required structure for plugins
 */
class BasicPlugin {
  constructor(eventManager) {
    // Required properties
    this.name = "Basic Plugin";
    this.version = "1.0.0";
    
    // Optional metadata
    this.description = "Adds basic functionality";
    this.author = "Your Name";
    
    this.eventManager = eventManager;
  }

  init() {
    // Setup event listeners
    this.eventManager.on('element:created', this.logElement);
    this.eventManager.on('project:loaded', this.setupProject);
  }

  cleanup() {
    // Remove all listeners
    this.eventManager.off('element:created', this.logElement);
    this.eventManager.off('project:loaded', this.setupProject);
  }

  logElement = (element) => {
    console.log(`New ${element.type} created at ${element.x},${element.y}`);
  };

  setupProject = (project) => {
    console.log(`Project loaded: ${project.name}`);
  };
}
```

## Best Practices

### Namespacing: Prefix your events (pluginname:event)

```javascript
this.eventManager.emit('measurement:show-popup', data);
```

### UI Integration: Add controls to toolbar

```javascript

init() {
  const button = document.createElement('button');
  button.textContent = 'Measure';
  button.onclick = () => this.activate();
  document.getElementById('tools-panel').appendChild(button);
}
```

### State Management: Maintain isolated state

```javascript

this.state = {
  measurements: [],
  active: false
};
```
