export class ARView {
  constructor(editor) {
    if (!window.ARjs) {
      console.warn('AR.js not loaded - AR disabled');
      return;
    }
    this.initAR();
  }
}