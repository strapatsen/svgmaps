# EventManager

The `EventManager` class provides an event system for inter-component communication.

## Methods

### `on(eventName, callback)`

Registers an event listener.

- **Parameters:**
- `eventName` (string): The name of the event (e.g., `'element:created'`).
- `callback` (Function): The handler function to execute when the event is triggered.

## Example Usage

### Listening to Multiple Events

```javascript
// Listen for the 'element:selected' event
editor.eventManager.on('element:selected', element => {
    console.log('Selected:', element);
    propertiesPanel.show(element);
});

// Listen for the 'project:loaded' event
editor.eventManager.on('project:loaded', project => {
    statusBar.show(`Loaded: ${project.name}`);
});
```

-------

```javascript
// Initialisatie
const eventManager = new EventManager();
const projectManager = new ProjectManager(eventManager);
const safetyPanel = new SafetyRulesPanel(projectManager);

// Nieuwe project maken
projectManager.newProject();

// Regels instellen
projectManager.updateSafetyRules('NL', {
  medical: {
    staffPerAttendees: 1/500 // Strengere regel voor dit project
  }
});

// Validatie uitvoeren
const safetyReport = projectManager.validateSafetyCompliance();
console.log(safetyReport);

// Bij opslaan worden regels automatisch meegenomen
projectManager.saveProject();
```