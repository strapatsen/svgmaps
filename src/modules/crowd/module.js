// modules/crowd-simulation/module.js
export default class CrowdSimulationModule {
    static moduleName = 'crowd-simulation';
    
    constructor(editor) {
      this.editor = editor;
      this.engine = new CrowdSimulationEngine(editor.terrainData);
    }
  
    init() {
      this.editor.eventManager.on('layout-changed', () => this.updateSimulation());
    }
  
    updateSimulation() {
      const results = this.engine.simulate(
        'normal',
        this.editor.state.attendees
      );
      this.editor.ui.updateHeatmap(results.heatmap);
    }
}