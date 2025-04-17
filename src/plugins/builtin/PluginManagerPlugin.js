// Plugin: PluginManagerPlugin.js
import { PluginBase } from '../PluginBase.js';

export class PluginManagerPlugin extends PluginBase {
    
    constructor(app, options = {}) {
        super(app, options);
        this.name = 'Plugin Manager';
        this.version = '1.0.0';
        this.description = 'Manage all plugins in the application';
        this.author = 'System';
        this.isBuiltin = true;
        this.currentTab = 'installed';
    }

    init() {
        this._setupUI();
        this._registerEvent('plugins:changed', () => this._updateUI());
        this._addToMenu();
    }

    _addToMenu() {
        this.addMenuItems({
            pluginManager: {
                label: 'Plugin Manager',
                action: () => this._showManager()
            },
            separator: { type: 'separator' }
        });
    }

    _setupUI() {
        this.panel = document.createElement('div');
        this.panel.className = 'plugin-manager-panel';
        this.panel.innerHTML = `
            <div class="plugin-manager-header">
                <h2>Plugin Manager</h2>
                <div class="plugin-tabs">
                    <button class="tab-btn active" data-tab="installed">Installed</button>
                    <button class="tab-btn" data-tab="available">Available</button>
                    <button class="tab-btn" data-tab="updates">Updates</button>
                </div>
            </div>
            <div class="plugin-tab-content">
                <div id="installed-tab" class="tab-content active"></div>
                <div id="available-tab" class="tab-content"></div>
                <div id="updates-tab" class="tab-content"></div>
            </div>
        `;

        document.body.appendChild(this.panel);
        this._setupTabEvents();
        this._updateUI();
    }

    _setupTabEvents() {
        this.panel.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentTab = btn.dataset.tab;
                this.panel.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.panel.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                this.panel.querySelector(`#${this.currentTab}-tab`).classList.add('active');
                this._updateUI();
            });
        });
    }

    _showManager() {
        this.panel.style.display = 'block';
        this._updateUI();
    }

    async _updateUI() {
        switch (this.currentTab) {
            case 'installed':
                this._renderInstalledTab();
                break;
            case 'available':
                await this._renderAvailableTab();
                break;
            case 'updates':
                await this._renderUpdatesTab();
                break;
        }
    }

    _renderInstalledTab() {
        const tab = this.panel.querySelector('#installed-tab');
        const plugins = this.app.pluginRegistry.getAll();
        const loadedPlugins = this.app.pluginRegistry.getLoaded();

        tab.innerHTML = `
            <div class="plugin-list">
                ${plugins.map(plugin => this._renderPluginCard(plugin, loadedPlugins)).join('')}
            </div>
        `;

        tab.querySelectorAll('.toggle-plugin').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pluginName = e.target.dataset.plugin;
                if (loadedPlugins.some(p => p.name === pluginName)) {
                    this.app.pluginRegistry.unload(pluginName);
                } else {
                    this.app.pluginRegistry.load(pluginName);
                }
            });
        });
    }

    async _renderAvailableTab() {
        const tab = this.panel.querySelector('#available-tab');
        tab.innerHTML = '<p>Loading available plugins...</p>';
        
        try {
            const availablePlugins = await this._fetchAvailablePlugins();
            tab.innerHTML = `
                <div class="plugin-list">
                    ${availablePlugins.map(plugin => this._renderAvailablePluginCard(plugin)).join('')}
                </div>
            `;

            tab.querySelectorAll('.install-plugin').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const pluginName = e.target.dataset.plugin;
                    await this._installPlugin(pluginName);
                });
            });
        } catch (error) {
            tab.innerHTML = `<p class="error">Failed to load available plugins: ${error.message}</p>`;
        }
    }

    async _renderUpdatesTab() {
        const tab = this.panel.querySelector('#updates-tab');
        tab.innerHTML = '<p>Checking for updates...</p>';
        
        try {
            const updates = await this._checkForUpdates();
            if (updates.length === 0) {
                tab.innerHTML = '<p>All plugins are up to date!</p>';
            } else {
                tab.innerHTML = `
                    <div class="update-list">
                        ${updates.map(update => this._renderUpdateCard(update)).join('')}
                    </div>
                `;

                tab.querySelectorAll('.update-plugin').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        const pluginName = e.target.dataset.plugin;
                        await this._updatePlugin(pluginName);
                    });
                });
            }
        } catch (error) {
            tab.innerHTML = `<p class="error">Failed to check updates: ${error.message}</p>`;
        }
    }

    _renderPluginCard(plugin, loadedPlugins) {
        const isLoaded = loadedPlugins.some(p => p.name === plugin.name);
        return `
            <div class="plugin-card ${plugin.isBuiltin ? 'builtin' : ''}">
                <div class="plugin-info">
                    <h3>${plugin.name} <span class="version">v${plugin.version}</span></h3>
                    <p class="description">${plugin.description}</p>
                    <p class="author">By ${plugin.author}</p>
                    ${plugin.isBuiltin ? '<p class="builtin-badge">Built-in</p>' : ''}
                </div>
                <div class="plugin-actions">
                    ${plugin.isBuiltin ? '' : `
                        <button class="toggle-plugin ${isLoaded ? 'active' : ''}" 
                                data-plugin="${plugin.name}">
                            ${isLoaded ? 'Disable' : 'Enable'}
                        </button>
                    `}
                </div>
            </div>
        `;
    }

    _renderAvailablePluginCard(plugin) {
        return `
            <div class="plugin-card available">
                <div class="plugin-info">
                    <h3>${plugin.name} <span class="version">v${plugin.version}</span></h3>
                    <p class="description">${plugin.description}</p>
                    <p class="author">By ${plugin.author}</p>
                    <div class="stats">
                        <span class="downloads">${plugin.downloads} downloads</span>
                        <span class="rating">${plugin.rating}★</span>
                    </div>
                </div>
                <div class="plugin-actions">
                    <button class="install-plugin" data-plugin="${plugin.name}">
                        Install
                    </button>
                </div>
            </div>
        `;
    }

    _renderUpdateCard(update) {
        return `
            <div class="update-card">
                <div class="plugin-info">
                    <h3>${update.name} <span class="version">v${update.currentVersion} → v${update.newVersion}</span></h3>
                    <p class="description">${update.description}</p>
                    <div class="changelog">
                        <h4>What's new:</h4>
                        <ul>
                            ${update.changelog.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="plugin-actions">
                    <button class="update-plugin" data-plugin="${update.name}">
                        Update
                    </button>
                </div>
            </div>
        `;
    }

    async _fetchAvailablePlugins() {
        // In a real app, this would fetch from your plugin repository
        return [
            {
                name: 'Advanced Export',
                version: '1.2.0',
                description: 'Additional export formats and options',
                author: 'Plugin Developer',
                downloads: 1245,
                rating: 4.5
            },
            {
                name: '3D Preview',
                version: '2.1.3',
                description: '3D visualization of your designs',
                author: '3D Team',
                downloads: 892,
                rating: 4.2
            }
        ];
    }

    async _checkForUpdates() {
        // In a real app, this would check versions against a repository
        const plugins = this.app.pluginRegistry.getAll();
        return plugins.filter(p => !p.isBuiltin).map(p => ({
            name: p.name,
            currentVersion: p.version,
            newVersion: '1.0.0', // This would come from the server
            description: p.description,
            changelog: [
                'Improved performance',
                'Fixed several bugs',
                'Added new features'
            ]
        }));
    }

    async _installPlugin(pluginName) {
        // In a real app, this would download and install the plugin
        this.app.eventManager.emit('plugin:install-start', { name: pluginName });
        
        // Simulate installation delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        this.app.eventManager.emit('plugin:installed', { name: pluginName });
        this._updateUI();
    }

    async _updatePlugin(pluginName) {
        // In a real app, this would update the plugin
        this.app.eventManager.emit('plugin:update-start', { name: pluginName });
        
        // Simulate update delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        this.app.eventManager.emit('plugin:updated', { name: pluginName });
        this._updateUI();
    }
}