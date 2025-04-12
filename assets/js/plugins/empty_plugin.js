// Basis plugin class
class TerrainEditorPlugin {
    constructor(eventManager) {
      this.eventManager = eventManager;
      this.name = 'Unnamed Plugin';
      this.version = '1.0.0';
      this.init();
    }
  
    init() {
      throw new Error('Plugin must implement init() method');
    }
  
    registerMenuItems() {
      return {};
    }
  
    cleanup() {}
}

// Voorbeeld plugin: MeasurementTools
class MeasurementPlugin extends TerrainEditorPlugin {
    constructor(eventManager) {
      super(eventManager);
      this.name = 'Measurement Tools';
      this.version = '1.2.0';
    }

    init() {
      this.eventManager.on('tool:measure:start', this.handleMeasurementStart.bind(this));
      this.eventManager.on('tool:measure:update', this.handleMeasurementUpdate.bind(this));
      this.eventManager.on('tool:measure:end', this.handleMeasurementEnd.bind(this));
    }

    registerMenuItems() {
      return {
        distance: { label: 'Measure Distance', action: 'tool:measure' },
        area: { label: 'Measure Area', action: 'tool:measure-area' }
      };
    }

    handleMeasurementStart(data) {
      console.log('Measurement started at:', data.x, data.y);
    }

    cleanup() {
      this.eventManager.off('tool:measure:start', this.handleMeasurementStart);
      this.eventManager.off('tool:measure:update', this.handleMeasurementUpdate);
      this.eventManager.off('tool:measure:end', this.handleMeasurementEnd);
    }
}