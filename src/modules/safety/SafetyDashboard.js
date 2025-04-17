class SafetyDashboard {
  
    constructor(ruleEngine) {
      this.engine = ruleEngine;
      this.initUI();
    }
  
    initUI() {
      this.createRuleSettingsPanel();
      this.createViolationList();
      this.createCapacityMeter();
    }
  
    createRuleSettingsPanel() {
      // UI om regels aan te passen per project
      // Bijvoorbeeld:
      this.ruleSelect = document.createElement('select');
      ['NL', 'BE', 'DE', 'Custom'].forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        this.ruleSelect.appendChild(option);
      });
      this.ruleSelect.addEventListener('change', () => {
        this.engine.loadRules(this.ruleSelect.value, {});
        this.engine.validateAll();
      });
    }
}