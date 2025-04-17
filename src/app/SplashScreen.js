// src/app/SplashScreen.js
export default class SplashScreen {
    constructor() {
        this.element = document.createElement('div');
        this.element.innerHTML = `
            <div class="splash-content">
                <h1>SVGMaps Editor</h1>
                <div class="progress-bar"></div>
            </div>
        `;
        document.body.appendChild(this.element);
    }
}