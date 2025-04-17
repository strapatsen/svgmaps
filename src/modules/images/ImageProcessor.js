// src/modules/image/ImageProcessor.js
export class ImageProcessor {
    constructor() {
      this.worker = new Worker(
        new URL('@/workers/image.processor.worker.js', import.meta.url),
        { type: 'module' }
      );
    }
  }