export default class CrowdSimulation {
    static moduleName = 'crowd';
    
    constructor(editor) {
      this.editor = editor;
      this.heatmap = new HeatmapRenderer();
    }
  
    run(config) {
      // Gebruik bestaande 2D elementen
      const elements = this.editor.elementManager.getAll();
      return this.calculateFlow(elements);
    }
}