// safety-visualizer.js
class SafetyVisualizer {
    constructor(terrain, ruleEngine) {
      this.terrain = terrain;
      this.ruleEngine = ruleEngine;
      this.layers = {
        crowdControl: this.createCrowdControlLayer(),
        personnel: this.createPersonnelLayer()
      };
    }
  
    createCrowdControlLayer() {
      // Heatmap voor druktegebieden
      return {
        id: 'crowd-density',
        type: 'heatmap',
        data: this.calculateDensity(),
        paint: {
          'heatmap-intensity': [
            'interpolate', ['linear'],
            ['get', 'density'],
            0, 0,
            this.ruleEngine.rules.security.maxDensity, 1
          ],
          'heatmap-color': [
            'interpolate', ['linear'],
            ['get', 'density'],
            0, 'rgba(0, 255, 0, 0)',
            0.5, 'yellow',
            0.8, 'orange',
            1, 'red'
          ]
        }
      };
    }
  
    createPersonnelLayer() {
      // Visualisatie van personeelstekorten
      return {
        id: 'personnel-coverage',
        type: 'circle',
        data: this.calculateCoverage(),
        paint: {
          'circle-color': [
            'case',
            ['>=', ['get', 'required'], ['get', 'actual']], 'green',
            'red'
          ],
          'circle-radius': 10
        }
      };
    }
  
    update() {
      this.ruleEngine.validateAll();
      this.layers.crowdControl.data = this.calculateDensity();
      this.layers.personnel.data = this.calculateCoverage();
    }
}