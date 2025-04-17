// app.js
import { Editor } from './core/Editor.js';
import { MenuSystem } from './ui/components/MenuSystem.js';
import { ToolbarManager } from './ui/components/ToolbarManager.js';
import { SideBar } from './ui/components/SideBar.js';
import { initThemeSwitcher } from './ui/themes/ThemeSwitcher.js';
import { PluginManager } from './plugins/PluginManager.js';
import { registerDefaultPlugins } from './plugins/pluginRegistry.js';
import Vendor from '../scripts/vendor.loader.js';

// ----------------------------- Configuration ----------------------------- //
const APP_CONFIG = {
    // Application metadata
    meta: {
        name: 'SVGMaps Editor',
        version: '1.0.0',
        build: process.env.BUILD_ID || 'development'
    },

    // Editor settings
    editor: {
        defaultProject: 'blank',
        enable3D: true,
        enableSafety: true
    },
    
    // Theme settings
    theme: {
        default: 'dark',
        available: ['dark', 'light', 'high-contrast'],
        saveToLocalStorage: true
    },
    
    // Auto-save settings
    autoSave: {
        enabled: true,
        interval: 5, // minutes
        maxVersions: 3
    },
    
    // Plugin system
    plugins: {
        builtIn: ['Measurement', 'ImportExport', 'SafetyChecker', 'PluginManager'],
        loadExternal: true
    },
    
    // Vendor libraries
    vendors: {
        required: ['axios', 'THREE', 'tensorflow', 'graphql', 'socketio', 'webworker'],
        optional: ['mapboxgl', 'turf', 'arjs', 'graphql', 'react3d']
    },
   
    // Debug settings
    debug: {
        enabled: false,
        exposeEditor: false,
        logLevel: 'warn'
    }
};

// --------------------------- Splash Screen --------------------------- //
class SplashScreen {

    constructor(config) {
        this.config = config;
        this.element = document.createElement('div');
        this.element.id = 'splash-screen';
        this.element.innerHTML = `
            <div class="splash-content">
                <div class="splash-logo">${config.meta.name}</div>
                <div class="splash-progress-container">
                    <div class="splash-progress-bar"></div>
                </div>
                <div class="splash-status">Initializing...</div>
                <div class="splash-version">v${config.meta.version}</div>
            </div>
        `;
        document.body.appendChild(this.element);
    }

    update(status, progress = null) {
        const statusEl = this.element.querySelector('.splash-status');
        if (statusEl) statusEl.textContent = status;
        
        if (progress !== null) {
            const progressBar = this.element.querySelector('.splash-progress-bar');
            if (progressBar) progressBar.style.width = `${progress}%`;
        }
    }

    remove() {
        this.element.classList.add('fade-out');
        setTimeout(() => {
            this.element.remove();
        }, 500);
    }

    showError(error) {
        this.update('Failed to initialize', 100);
        this.element.innerHTML += `
            <div class="splash-error">
                <h3>Startup Error</h3>
                <p>${error.message}</p>
                <button onclick="window.location.reload()">Retry</button>
            </div>
        `;
    }
}

// --------------------------- Vendor Loader --------------------------- //
class VendorLoader {
    constructor(config) {
        this.config = config;
        this.loaded = {};
        this.failed = {};
    }

    async loadRequired() {
        for (const name of this.config.vendors.required) {
            try {
                this.loaded[name] = await this._loadSingleVendor(name);
            } catch (error) {
                throw new Error(`Required vendor failed: ${name}`);
            }
        }
        return this.loaded;
    }

    async loadOptional() {
        await Promise.all(this.config.vendors.optional.map(async (name) => {
            try {
                this.loaded[name] = await this._loadSingleVendor(name);
            } catch (error) {
                console.warn(`Optional vendor ${name} failed:`, error);
                this.failed[name] = error;
            }
        }));
        return this.loaded;
    }

    async _loadSingleVendor(name) {
        if (!Vendor[name]) {
            throw new Error(`Vendor ${name} not configured`);
        }
        return await Vendor[name]();
    }
}

// --------------------------- Main Application --------------------------- //
class SVGMapEditorApp {

    constructor(config) {
        this.config = config;
        this.splash = new SplashScreen(config);
        this.vendorLoader = new VendorLoader(config);
        this.editor = null;
        this.ui = {
            menuSystem: null,
            toolbarManager: null,
            sideBar: null
        };
    }

    async initialize() {
        try {
            // Phase 1: Load vendors
            await this._loadVendors();
            
            // Phase 2: Initialize core editor
            await this._initEditor();
            
            // Phase 3: Initialize UI components
            await this._initUI();
            
            // Phase 4: Set up theme
            await this._initTheme();
            
            // Phase 5: Load plugins
            await this._loadPlugins();
            
            // Phase 6: Final setup
            await this._finalSetup();
            
            this.splash.update('Ready!', 100);
            setTimeout(() => this.splash.remove(), 1000);
            
            return this.editor;
        } catch (error) {
            this.splash.showError(error);
            console.error('App initialization failed:', error);
            throw error;
        }
    }

    async _loadVendors() {
        this.splash.update('Loading required libraries...', 10);
        await this.vendorLoader.loadRequired();
        
        this.splash.update('Loading optional libraries...', 20);
        await this.vendorLoader.loadOptional();
        
        // Configure loaded vendors
        if (this.vendorLoader.loaded.mapboxgl) {
            this.vendorLoader.loaded.mapboxgl.accessToken = process.env.MAPBOX_TOKEN;
        }
    }

    async _initEditor() {
        this.splash.update('Initializing editor core...', 30);
        
        // Merge with user config from localStorage
        const userConfig = JSON.parse(localStorage.getItem('editor-config')) || {};
        const finalConfig = { ...this.config, ...userConfig };
        
        this.editor = new Editor(finalConfig);
        
        // Debug exposure
        if (this.config.debug.exposeEditor) {
            window.__EDITOR = this.editor;
        }
    }

    async _initUI() {
        this.splash.update('Initializing UI...', 40);
        
        // Initialize UI components
        this.ui.menuSystem = new MenuSystem(this.editor);
        this.ui.toolbarManager = new ToolbarManager(this.editor);
        this.ui.sideBar = new SideBar(this.editor);
        
        // Connect UI to editor
        this._connectUIEvents();
    }

    _connectUIEvents() {
        // Connect menu system events
        this.editor.eventManager.on('project:changed', () => {
            this.ui.menuSystem.updateMenuState();
            this.ui.toolbarManager.updateButtonStates();
        });
        
        // Connect toolbar events
        this.editor.eventManager.on('tool:changed', (tool) => {
            this.ui.toolbarManager.updateActiveTool(tool);
            this.ui.menuSystem.updateActiveTool(tool);
        });
    }

    async _initTheme() {
        this.splash.update('Setting up theme...', 50);
        initThemeSwitcher(this.editor);
    }

    async _loadPlugins() {
        this.splash.update('Loading plugins...', 60);
        
        // Register default plugins
        await registerDefaultPlugins(this.editor);
        
        // Load built-in plugins
        await Promise.all(
            this.config.plugins.builtIn.map(name => 
                this.editor.pluginManager.load(name)
                    .catch(err => console.error(`Plugin ${name} failed:`, err))
        ));
        
        // Initialize plugin manager (must be last)
        this.splash.update('Initializing plugin system...', 75);
        await this.editor.pluginManager.initialize();
    }

    async _finalSetup() {
        this.splash.update('Finalizing setup...', 90);
        
        // Unsaved changes guard
        window.addEventListener('beforeunload', (e) => {
            if (this.editor.projectManager.hasUnsavedChanges()) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
        
        // Service worker for PWA
        if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
            try {
                await navigator.serviceWorker.register('/sw.js');
            } catch (err) {
                console.warn('ServiceWorker failed:', err);
            }
        }
        
        // Start the editor
        await this.editor.start();
        
        // Notify complete
        this.editor.eventManager.emit('app:ready');
    }
}

// ----------------------------- Startup ----------------------------- //
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const app = new SVGMapEditorApp(APP_CONFIG);
        await app.initialize();
        
        if (APP_CONFIG.debug.enabled) {
            console.log('DEBUG: App initialized', {
                config: APP_CONFIG,
                editor: app.editor
            });
        }
    } catch (error) {
        console.error('Fatal startup error:', error);
    }
});