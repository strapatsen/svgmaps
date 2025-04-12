// Event management
class EventManager {
	constructor() {
	  this.listeners = new Map();
	  this.debugMode = false;
	}
  
	on(event, callback, options = {}) {
	  if (!this.listeners.has(event)) {
		this.listeners.set(event, []);
	  }
	  
	  const listener = {
		callback,
		once: options.once || false,
		context: options.context || null
	  };
	  
	  this.listeners.get(event).push(listener);
	  
	  // Return unsubscribe function
	  return () => this.off(event, callback);
	}
  
	once(event, callback) {
	  return this.on(event, callback, { once: true });
	}
  
	off(event, callback) {
	  if (!this.listeners.has(event)) return;
	  
	  const listeners = this.listeners.get(event);
	  const index = listeners.findIndex(l => l.callback === callback);
	  
	  if (index !== -1) {
		listeners.splice(index, 1);
	  }
	}
  
	emit(event, data = {}) {
	  if (this.debugMode) {
		console.log(`[Event] ${event}`, data);
	  }
  
	  if (!this.listeners.has(event)) return;
  
	  const listeners = this.listeners.get(event);
	  const toRemove = [];
  
	  listeners.forEach((listener, index) => {
		try {
		  listener.callback.call(listener.context, data);
		  if (listener.once) {
			toRemove.push(index);
		  }
		} catch (error) {
		  console.error(`Error in event listener for ${event}:`, error);
		}
	  });
  
	  // Remove once listeners in reverse order
	  toRemove.reverse().forEach(index => {
		listeners.splice(index, 1);
	  });
	}
  
	destroy() {
	  this.listeners.clear();
	}
}
  
// Export voor modulair gebruik
export default EventManager;