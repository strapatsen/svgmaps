// SideBar.js
export class SideBar {
    /**
     * Creates a new SideBar instance
     * @param {Editor} editor - Reference to the main editor instance
     */
    constructor(editor) {
        this.editor = editor;
        this.dom = {
            legendPanel: document.getElementById('legend-panel'),
            closeLegendButton: document.getElementById('close-legend'),
            tabButtons: document.querySelectorAll('.legend-tabs .tab-btn'),
            tabContents: document.querySelectorAll('.legend-content .tab-content')
        };

        this._setupEventListeners();
        this._initTabState();
    }

    /**
     * Sets up event listeners
     * @private
     */
    _setupEventListeners() {
        // Close button
        this.dom.closeLegendButton?.addEventListener('click', () => {
            this.dom.legendPanel.classList.remove('active');
        });

        // Tab buttons
        this.dom.tabButtons?.forEach(tabButton => {
            tabButton.addEventListener('click', () => this._handleTabClick(tabButton));
        });

        // Editor events
        this.editor.eventManager.on('project:loaded', () => this._updateLegendContent());
        this.editor.eventManager.on('element:changed', () => this._updateLegendContent());
    }

    /**
     * Initializes the default tab state
     * @private
     */
    _initTabState() {
        if (this.dom.tabButtons.length > 0 && !document.querySelector('.tab-btn.active')) {
            this.dom.tabButtons[0].classList.add('active');
            const defaultTab = this.dom.tabButtons[0].getAttribute('data-tab');
            document.getElementById(`${defaultTab}-tab`)?.classList.add('active');
        }
    }

    /**
     * Handles tab click events
     * @private
     */
    _handleTabClick(tabButton) {
        // Activate panel if not active
        if (!this.dom.legendPanel.classList.contains('active')) {
            this.dom.legendPanel.classList.add('active');
        }

        // Update tab states
        this.dom.tabButtons.forEach(btn => btn.classList.remove('active'));
        this.dom.tabContents.forEach(content => content.classList.remove('active'));

        tabButton.classList.add('active');
        const targetTab = tabButton.getAttribute('data-tab');
        document.getElementById(`${targetTab}-tab`)?.classList.add('active');
    }

    /**
     * Updates legend content based on current project state
     * @private
     */
    _updateLegendContent() {
        // Implementation depends on your specific legend content needs
        // Example:
        // const elements = this.editor.elementManager.getAllElements();
        // Update DOM based on elements
    }

    /**
     * Toggles the sidebar visibility
     * @param {boolean} [forceState] - Optional forced state
     */
    toggle(forceState) {
        if (typeof forceState === 'boolean') {
            this.dom.legendPanel.classList.toggle('active', forceState);
        } else {
            this.dom.legendPanel.classList.toggle('active');
        }
    }

    /**
     * Adds a new tab to the sidebar
     * @param {string} tabId - Unique tab identifier
     * @param {string} tabName - Display name
     * @param {HTMLElement} content - Tab content element
     */
    addTab(tabId, tabName, content) {
        // Create tab button
        const tabButton = document.createElement('button');
        tabButton.className = 'tab-btn';
        tabButton.textContent = tabName;
        tabButton.setAttribute('data-tab', tabId);
        tabButton.addEventListener('click', () => this._handleTabClick(tabButton));

        // Add to tabs container
        const tabsContainer = document.querySelector('.legend-tabs');
        tabsContainer?.appendChild(tabButton);

        // Create content container
        const tabContent = document.createElement('div');
        tabContent.id = `${tabId}-tab`;
        tabContent.className = 'tab-content';
        tabContent.appendChild(content);

        // Add to content container
        const contentContainer = document.querySelector('.legend-content');
        contentContainer?.appendChild(tabContent);

        // Update DOM references
        this.dom.tabButtons = document.querySelectorAll('.legend-tabs .tab-btn');
        this.dom.tabContents = document.querySelectorAll('.legend-content .tab-content');

        // Activate new tab if first one
        if (this.dom.tabButtons.length === 1) {
            this._handleTabClick(tabButton);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialization now handled by Editor class
});