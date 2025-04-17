import { PluginBase } from '../PluginBase.js';

export class ImportExportPlugin extends PluginBase {
    constructor(app) {
        super(app);
        this.name = 'ImportExport';
        this.version = '1.0.0';
        this.supportedFormats = ['SVG', 'PNG', 'JSON'];
    }

    init() {
        this._setupMenuItems();
        this._registerHandlers();
    }

    _setupMenuItems() {
        this.addMenuItems({
            importFile: {
                label: 'Import...',
                shortcut: 'Ctrl+I',
                action: () => this._importFile()
            },
            exportFile: {
                label: 'Export...',
                submenu: this.supportedFormats.map(format => ({
                    [`export${format}`]: {
                        label: `As ${format}`,
                        action: () => this._exportFile(format)
                    }
                })).reduce((a, b) => ({ ...a, ...b }), {})
            }
        });
    }

    _registerHandlers() {
        this._registerEvent('project:export-request', (format) => {
            this._exportFile(format);
        });
    }

    async _importFile() {
        try {
            const file = await this.app.fileSystem.openFileDialog();
            const content = await this.app.fileSystem.readFile(file);
            this.app.eventManager.emit('project:import', { file, content });
        } catch (error) {
            this._handleError('Import failed', error);
        }
    }

    async _exportFile(format) {
        try {
            const data = await this.app.projectManager.exportProject(format);
            const filename = `export-${Date.now()}.${format.toLowerCase()}`;
            await this.app.fileSystem.saveFile(filename, data);
        } catch (error) {
            this._handleError(`Export to ${format} failed`, error);
        }
    }
}