import { PluginBase } from '../PluginBase.js';

export class MeasurementPlugin extends PluginBase {
    constructor(app) {
        super(app);
        this.name = 'Measurement';
        this.version = '1.1.0';
        this.units = 'meters';
        this.precision = 2;
    }

    init() {
        this._registerTools();
        this._setupEventListeners();
    }

    _registerTools() {
        this.addTools([
            {
                name: 'distanceMeasure',
                ToolClass: DistanceMeasureTool
            },
            {
                name: 'areaMeasure',
                ToolClass: AreaMeasureTool
            }
        ]);
    }

    _setupEventListeners() {
        this._registerEvent('measurement:complete', (result) => {
            this._showMeasurement(result);
        });
    }

    _showMeasurement(result) {
        const { type, value, unit } = result;
        this.app.notification.show(
            `${type}: ${value.toFixed(this.precision)} ${unit}`,
            { timeout: 3000 }
        );
    }

    setUnits(units) {
        this.units = units;
        this.app.eventManager.emit('measurement:units-changed', units);
    }
}

class DistanceMeasureTool {
    constructor() {
        this.name = 'Distance Measure Tool';
    }

    activate(context) {
        console.log(`${this.name} activated.`);
        // Add logic to start measuring distance
    }

    deactivate() {
        console.log(`${this.name} deactivated.`);
        // Add logic to clean up after measuring
    }

    measure(startPoint, endPoint) {
        const dx = endPoint.x - startPoint.x;
        const dy = endPoint.y - startPoint.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

class AreaMeasureTool {
    constructor() {
        this.name = 'Area Measure Tool';
    }

    activate(context) {
        console.log(`${this.name} activated.`);
        // Add logic to start measuring area
    }

    deactivate() {
        console.log(`${this.name} deactivated.`);
        // Add logic to clean up after measuring
    }

    measure(points) {
        if (points.length < 3) {
            throw new Error('At least 3 points are required to measure area.');
        }

        let area = 0;
        for (let i = 0; i < points.length; i++) {
            const j = (i + 1) % points.length;
            area += points[i].x * points[j].y - points[j].x * points[i].y;
        }
        return Math.abs(area / 2);
    }
}