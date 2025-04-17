export class ViewSwitch {
    constructor(editor) {
      this.editor = editor;
      this.createUI();
    }
  
    createUI() {
      this.node = document.createElement('div');
      this.node.innerHTML = `
        <button data-view="2d">2D</button>
        <button data-view="3d">3D</button>
      `;
    }
}