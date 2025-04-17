
// ThemeSwitcher.js
export class ThemeSwitcher {
  /**
   * Creates a ThemeSwitcher instance
   * @param {HTMLElement} container - Container element for the switcher
   * @param {Editor} [editor] - Optional editor reference
   */
  constructor(container = document.body, editor = null) {
      if (!container) {
          throw new Error('Container element is required');
      }

      this.container = container;
      this.editor = editor;
      this.themes = Object.values(ThemeManager.themes);
      this.select = null;

      this._init();
  }

  /* ------------------------ Private Methods ------------------------ */

  /**
   * Initializes the theme switcher
   * @private
   */
  _init() {
      this._renderButtons();
      this._setupEventListeners();
      this._addMobileDropdown();
      this._applySavedTheme();
  }

  /**
   * Renders theme buttons
   * @private
   */
  _renderButtons() {
      this.wrapper = document.createElement('div');
      this.wrapper.className = 'theme-switcher';
      this.wrapper.setAttribute('aria-label', 'Theme switcher');

      this.themes.forEach(theme => {
          const btn = document.createElement('button');
          btn.className = 'theme-btn';
          btn.dataset.theme = theme.name;
          btn.innerHTML = `${theme.icon}<span class="sr-only">${theme.label}</span>`;
          btn.setAttribute('aria-pressed', ThemeManager.current === theme.name);
          
          if (ThemeManager.current === theme.name) {
              btn.classList.add('active');
          }

          this.wrapper.appendChild(btn);
      });

      this.container.appendChild(this.wrapper);
  }

  /**
   * Sets up event listeners
   * @private
   */
  _setupEventListeners() {
      // Theme button clicks
      this.wrapper.addEventListener('click', (e) => {
          const btn = e.target.closest('.theme-btn');
          if (btn) {
              this.setTheme(btn.dataset.theme);
          }
      });

      // Theme change events
      document.addEventListener('theme:changed', (e) => {
          this._updateActiveState(e.detail.theme);
      });

      // Editor integration
      if (this.editor) {
          document.addEventListener('theme:changed', (e) => {
              this.editor.eventManager.emit('theme:changed', e.detail);
          });
      }
  }

  /**
   * Adds mobile dropdown for smaller screens
   * @private
   */
  _addMobileDropdown() {
      this.select = document.createElement('select');
      this.select.className = 'theme-switcher-select';
      this.select.setAttribute('aria-label', 'Select theme');

      this.themes.forEach(theme => {
          const option = document.createElement('option');
          option.value = theme.name;
          option.textContent = theme.label;
          if (ThemeManager.current === theme.name) {
              option.selected = true;
          }
          this.select.appendChild(option);
      });

      this.select.addEventListener('change', (e) => {
          this.setTheme(e.target.value);
      });

      this.container.appendChild(this.select);
      this._setupResponsiveBehavior();
  }

  /**
   * Sets up responsive behavior
   * @private
   */
  _setupResponsiveBehavior() {
      const mediaQuery = window.matchMedia('(max-width: 600px)');
      
      const handleMediaChange = (e) => {
          const isMobile = e.matches;
          this.wrapper.style.display = isMobile ? 'none' : 'flex';
          this.select.style.display = isMobile ? 'block' : 'none';
      };

      // Initial check
      handleMediaChange(mediaQuery);
      
      // Listen for changes
      mediaQuery.addEventListener('change', handleMediaChange);
  }

  /**
   * Applies saved theme
   * @private
   */
  _applySavedTheme() {
      const savedTheme = localStorage.getItem('ui-theme');
      if (savedTheme && ThemeManager.themes[savedTheme]) {
          this.setTheme(savedTheme, false);
      }
  }

  /**
   * Updates active state of buttons
   * @private
   */
  _updateActiveState(themeName) {
      // Update buttons
      this.wrapper.querySelectorAll('.theme-btn').forEach(btn => {
          const isActive = btn.dataset.theme === themeName;
          btn.classList.toggle('active', isActive);
          btn.setAttribute('aria-pressed', isActive);
      });

      // Update select
      if (this.select) {
          this.select.value = themeName;
      }
  }

  /* ------------------------ Public Methods ------------------------ */

  /**
   * Sets the current theme
   * @param {string} themeName - Name of the theme to set
   * @param {boolean} [save=true] - Whether to save the theme preference
   */
  setTheme(themeName, save = true) {
      // Add transition class
      document.documentElement.classList.add('theme-transition');
      
      // Remove transition after animation completes
      const onTransitionEnd = () => {
          document.documentElement.classList.remove('theme-transition');
          document.documentElement.removeEventListener('transitionend', onTransitionEnd);
      };
      document.documentElement.addEventListener('transitionend', onTransitionEnd);

      // Set the new theme
      ThemeManager.set(themeName, save);
  }

  /**
   * Resets to default theme
   */
  resetTheme() {
      this.setTheme('default');
  }

  /**
   * Adds a custom theme
   * @param {Object} theme - Theme definition
   */
  addCustomTheme(theme) {
      if (!theme.name || !theme.className) {
          throw new Error('Theme must have name and className properties');
      }

      ThemeManager.themes[theme.name] = {
          icon: theme.icon || '🎨',
          label: theme.label || theme.name,
          ...theme
      };

      // Re-render the switcher
      this.wrapper.remove();
      if (this.select) this.select.remove();
      this._init();
  }
}

// Initialization with Editor integration
export function initThemeSwitcher(editor) {
  const container = document.querySelector('.toolbar') || document.body;
  const themeSwitcher = new ThemeSwitcher(container, editor);

  // Reset button handler
  document.querySelector('.reset-theme')?.addEventListener('click', () => {
      themeSwitcher.resetTheme();
  });

  return themeSwitcher;
}