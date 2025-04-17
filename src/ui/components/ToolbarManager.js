export class ToolbarManager {
    constructor(editor) {
        this.editor = editor;
        this.eventManager = editor.eventManager;
        this.toolManager = editor.toolManager;
        this.dom = {
            toolbar: document.querySelector('.toolbar'),
            buttons: {}
        };
        
        this._cacheDomElements();
        this._setupEventListeners();
        this._setupToolButtons();
    }

    _cacheDomElements() {
        // Cache alle toolbar buttons
        this.dom.buttons = {
            undo: document.getElementById('undo'),
            redo: document.getElementById('redo'),
            newProject: document.getElementById('new-project'),
            saveProject: document.getElementById('save-project'),
            // ... alle andere buttons
        };
    }

    _setupEventListeners() {
        // Project acties
        this.dom.buttons.newProject.addEventListener('click', () => {
            this.eventManager.emit('project:new');
        });
        
        this.dom.buttons.saveProject.addEventListener('click', () => {
            this.eventManager.emit('project:save');
        });
        
        // Tool acties
        document.querySelectorAll('.tool-btn').forEach(button => {
            button.addEventListener('click', () => {
                const tool = button.dataset.tool;
                this.eventManager.emit('tool:select', tool);
            });
        });
        
        // Abonneer op state updates
        this.eventManager.on('project:changed', () => this._updateButtonStates());
        this.eventManager.on('tool:changed', (tool) => this._updateActiveTool(tool));
    }

    _setupToolButtons() {
        // Registreer tools in de ToolManager
        const tools = {
            select: { icon: 'mouse-pointer', shortcut: 'V' },
            line: { icon: 'slash', shortcut: 'L' },
            rect: { icon: 'square', shortcut: 'R' },
            // ... andere tools
        };
        
        Object.entries(tools).forEach(([name, config]) => {
            this.toolManager.registerTool(name, config);
        });
    }

    _updateButtonStates() {
        this.dom.buttons.toggleGrid.classList.toggle('active', this.editor.viewportManager.gridVisible);
        this.dom.buttons.measureToggle.classList.toggle('active',this.editor.viewportManager.rulersVisible);
        this.dom.buttons.pluginToggle.classList.toggle('active', this.editor.pluginManager.isActive);
        this.dom.buttons.undo.disabled = !this.editor.projectManager.canUndo();
        this.dom.buttons.redo.disabled = !this.editor.projectManager.canRedo();
    }

    updateButtonStates() {
        this.dom.buttons.toggleGrid.classList.toggle('active', this.editor.viewportManager.gridVisible);
        this.dom.buttons.measureToggle.classList.toggle('active',this.editor.viewportManager.rulersVisible);
        this.dom.buttons.pluginToggle.classList.toggle('active', this.editor.pluginManager.isActive);
        this.dom.buttons.undo.disabled = !this.editor.projectManager.canUndo();
        this.dom.buttons.redo.disabled = !this.editor.projectManager.canRedo();
    }

    _updateActiveTool(tool) {
        // Update visuele staat van tool buttons
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tool === tool);
        });
    }
}