// ThemeManager.js
export class ThemeManager {
    /**
     * ThemeManager class to manage UI themes
     * @class ThemeManager
     */

    static themes = {
        default: {
            name: 'default',
            icon: '🌙',
            label: 'Dark',
            className: 'theme-dark'
        },
        light: {
            name: 'light',
            icon: '🌞',
            label: 'Light',
            className: 'theme-light'
        }
    };
  
    static current = 'default';
  
    static init() {
        const savedTheme = localStorage.getItem('ui-theme');
        if (savedTheme && this.themes[savedTheme]) {
            this.set(savedTheme, false);
        }
    }
  
    static set(themeName, save = true) {
        if (!this.themes[themeName]) return false;
  
        // Remove all theme classes
        document.documentElement.classList.remove(
            ...Object.values(this.themes).map(t => t.className)
        );
  
        // Add new theme class
        document.documentElement.classList.add(this.themes[themeName].className);
        this.current = themeName;
  
        if (save) {
            localStorage.setItem('ui-theme', themeName);
        }
  
        document.dispatchEvent(new CustomEvent('theme:changed', {
            detail: { theme: themeName }
        }));
  
        return true;
    }
  
    static getCurrentTheme() {
        return this.themes[this.current];
    }
  
    static reset() {
        localStorage.removeItem('ui-theme');
        this.set('default');
    }
}