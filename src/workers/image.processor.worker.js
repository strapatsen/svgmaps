self.onmessage = async (event) => {
    const { action, imageData, options } = event.data;

    try {
        switch (action) {
            case 'processImage':
                const processedImageData = await processImage(imageData, options);
                self.postMessage({ success: true, imageData: processedImageData });
                break;
            default:
                self.postMessage({ success: false, error: 'Unknown action' });
        }
    } catch (error) {
        self.postMessage({ success: false, error: error.message });
    }
};

async function processImage(imageData, options) {
    // Example: Apply grayscale filter
    const { width, height, data } = imageData;
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg; // Red
        data[i + 1] = avg; // Green
        data[i + 2] = avg; // Blue
    }
    return new ImageData(data, width, height);
}