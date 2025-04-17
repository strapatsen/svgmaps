// src/core/EventManager.js
export class EventManager {
    constructor() {
        this._listeners = new Map();
        this._debugMode = false;
        this._eventHistory = []; // Nieuwe toegevoegd voor debugging
    }

    on(event, callback, options = {}) {
        if (typeof callback !== 'function') {
            throw new TypeError('Callback must be a function');
        }

        if (!this._listeners.has(event)) {
            this._listeners.set(event, new Set()); // Gebruik Set i.p.v. Array
        }

        const listener = {
            callback,
            once: !!options.once,
            context: options.context || null,
            id: Symbol('listenerId') // Unieke identifier voor snellere removal
        };

        this._listeners.get(event).add(listener);

        // Return een propere unsubscribe functie
        return () => this._listeners.get(event)?.delete(listener);
    }

    once(event, callback, options = {}) {
        return this.on(event, callback, { ...options, once: true });
    }

    off(event, callback) {
        if (!this._listeners.has(event)) return;

        const listeners = this._listeners.get(event);
        for (const listener of listeners) {
            if (listener.callback === callback) {
                listeners.delete(listener);
                break; // Stop na eerste match
            }
        }
    }

    emit(event, data = {}) {
        if (this._debugMode) {
            console.log(`[Event] ${event}`, data);
            this._eventHistory.push({
                event,
                data,
                timestamp: performance.now() // Meer precies dan Date.now()
            });
        }

        if (!this._listeners.has(event)) return;

        // Nieuwe Set voor elke emit om concurrentieproblemen te voorkomen
        const listeners = new Set(this._listeners.get(event));
        const toRemove = [];

        listeners.forEach(listener => {
            try {
                listener.callback.call(listener.context, data);
                if (listener.once) {
                    toRemove.push(listener.id);
                }
            } catch (error) {
                console.error(`Error in ${event} handler:`, error);
                this._emitError(error, event, data);
            }
        });

        // Verwijder once listeners
        if (toRemove.length) {
            const currentListeners = this._listeners.get(event);
            toRemove.forEach(id => {
                for (const listener of currentListeners) {
                    if (listener.id === id) {
                        currentListeners.delete(listener);
                        break;
                    }
                }
            });
        }
    }

    // Nieuwe methodes
    _emitError(error, event, data) {
        if (this._listeners.has('error')) {
            this.emit('error', { error, event, data });
        }
    }

    clearEvent(event) {
        this._listeners.delete(event);
    }

    clearAll() {
        this._listeners.clear();
    }

    getListenerCount(event) {
        return this._listeners.has(event) ? this._listeners.get(event).size : 0;
    }

    // Debugging helpers
    enableDebugging(enable = true) {
        this._debugMode = enable;
    }

    getEventHistory() {
        return [...this._eventHistory];
    }

    destroy() {
        this.clearAll();
        this._eventHistory = [];
    }
}