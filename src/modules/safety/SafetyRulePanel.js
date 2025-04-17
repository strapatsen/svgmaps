// Voorbeeld van hoe je UI controle kunt toevoegen
class SafetyRulesPanel {
    constructor(projectManager) {
      this.projectManager = projectManager;
      this.initUI();
    }
  
    initUI() {
      this.countrySelect = document.getElementById('safety-country');
      this.attendeeInput = document.getElementById('expected-attendees');
      this.customRulesForm = document.getElementById('custom-rules-form');
      
      this.countrySelect.addEventListener('change', () => this.updateRules());
      this.attendeeInput.addEventListener('input', () => this.updateAttendees());
      this.customRulesForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.updateCustomRules();
      });
    }
  
    updateRules() {
      const countryCode = this.countrySelect.value;
      this.projectManager.updateSafetyRules(countryCode);
    }
  
    updateAttendees() {
      const attendees = parseInt(this.attendeeInput.value) || 0;
      if (this.projectManager.currentProject) {
        this.projectManager.currentProject.attendees = attendees;
        this.projectManager.eventManager.emit('project:attendees-changed', attendees);
      }
    }
  
    updateCustomRules() {
      const formData = new FormData(this.customRulesForm);
      const customRules = Object.fromEntries(formData.entries());
      this.projectManager.updateSafetyRules(
        this.countrySelect.value,
        customRules
      );
    }
  }