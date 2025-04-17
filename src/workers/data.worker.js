self.onmessage = (e) => {
    try {
        console.log('Worker received message:', e.data);

        // Perform heavy processing
        const result = heavyProcessing(e.data);

        // Use transferable objects if applicable
        if (result instanceof ArrayBuffer) {
            postMessage(result, [result]);
        } else {
            postMessage(result);
        }

        console.log('Worker finished processing.');
    } catch (error) {
        console.error('Error in worker:', error);
        postMessage({ error: error.message });
    }
};