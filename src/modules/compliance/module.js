export default class ComplianceModule {
    static moduleName = 'compliance';
    
    constructor(editor) {
      this.manager = new ComplianceManager('NL');
    }
  
    init() {
      this.editor.eventManager.on('project-loaded', () => {
        this.manager.checkPermits(this.editor.terrain);
      });
    }
}