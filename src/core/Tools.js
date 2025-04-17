// Tools.js

import { TerrainElement } from './TerrainElement.js';
import { pluginTools } from '../plugins/PluginManager.js';


export class Tool {
    constructor(eventManager, name) {
        this._eventManager = eventManager;
        this._name = name;
        this._cursor = 'default';
        this._isActive = false;
        this._tempElement = null;
        this._startPosition = { x: 0, y: 0 };
        this._lastPosition = { x: 0, y: 0 };
        this._svgData = null;
    }

    /* ---------------------- Lifecycle Methods ---------------------- */
    activate() {
        this._isActive = true;
        this._eventManager.emit('tool:activated', { tool: this._name });
    }

    deactivate() {
        this._isActive = false;
        this._cleanup();
        this._eventManager.emit('tool:deactivated', { tool: this._name });
    }

    /* ------------------------ Event Handlers ------------------------ */
    handleStart(x, y, event) {
        this._startPosition = { x, y };
        this._lastPosition = { x, y };
    }

    handleMove(x, y, event) {
        this._lastPosition = { x, y };
    }

    handleEnd(x, y, event) {
        this._cleanup();
    }

    handleDoubleClick(x, y, event) {}
    handleKeyDown(event) {}

    /* ------------------------ Element Creation ------------------------ */
    _createElement(type, shape, x, y, width, height, options = {}) {
        const element = new TerrainElement(
            type,
            shape,
            x, y, width, height,
            { ...options, tool: this._name }
        );
        
        this._eventManager.emit('element:create', element.serialize());
        return element;
    }

    _createTempElement(type, shape, x, y, width, height, options = {}) {
        this._cleanupTempElement();
        this._tempElement = this._createElement(
            type, shape, x, y, width, height, 
            { ...options, isTemp: true }
        );
        return this._tempElement;
    }

    _updateTempElement(updates) {
        if (this._tempElement) {
            Object.assign(this._tempElement, updates);
            this._eventManager.emit('element:update-temp', this._tempElement.serialize());
        }
    }

    /* ------------------------ Utility Methods ------------------------ */
    _cleanup() {
        this._cleanupTempElement();
    }

    _cleanupTempElement() {
        if (this._tempElement) {
            this._eventManager.emit('element:remove-temp', this._tempElement.id);
            this._tempElement = null;
        }
    }

    _snapToGrid(x, y, gridSize = null) {
        const size = gridSize || this._eventManager.projectManager?.currentProject?.gridSize || 10;
        return {
            x: Math.round(x / size) * size,
            y: Math.round(y / size) * size
        };
    }

    _calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    /* ------------------------ Getters ------------------------ */
    get name() {
        return this._name;
    }

    get cursor() {
        return this._cursor;
    }

    get isActive() {
        return this._isActive;
    }

    get svgData() {
        return this._svgData;
    }
}

/* ------------------------------- Basic Tools ------------------------ */

export class ExternalSVGTool extends Tool {
    constructor(eventManager) {
        super(eventManager, 'svg-import');
        this._cursor = 'pointer';
        this._svgData = null;
        this._svgElement = null;
        this._svgPath = null;
        this._svgGroup = null;
        this._svgText = null;
        this._svgRect = null;
        this._svgCircle = null;
        this._svgLine = null;
        this._svgPolygon = null;
        this._svgPolyline = null;
        this._svgDefs = null;
        this._svgGradient = null;
        this._svgPattern = null;
    }
    
    handleStart(x, y, event) {
        super.handleStart(x, y, event);
    }
    
    handleEnd(x, y, event) {
        super.handleEnd(x, y, event);
    }
    
    handleKeyDown(event) {
        if (event.key === 'Escape') {
            this._cleanup();
            this._eventManager.emit('tool:cancel-current');
        }
    }

    _cleanup() {
        super._cleanup();
        this._svgData = null;
    }
    _createSVGElement() {
        const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svgElement.setAttribute('viewBox', '0 0 100 100');
        return svgElement;
    }
    _createSVGPath(d) {
        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElement.setAttribute('d', d);
        return pathElement;
    }
    _createSVGGroup() {
        const groupElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        return groupElement;
    }
    _createSVGText(text) {
        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.textContent = text;
        return textElement;
    }
    _createSVGRect(x, y, width, height) {
        const rectElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rectElement.setAttribute('x', x);
        rectElement.setAttribute('y', y);
        rectElement.setAttribute('width', width);
        rectElement.setAttribute('height', height);
        return rectElement;
    }
    _createSVGCircle(cx, cy, r) {
        const circleElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circleElement.setAttribute('cx', cx);
        circleElement.setAttribute('cy', cy);
        circleElement.setAttribute('r', r);
        return circleElement;
    }
    _createSVGLine(x1, y1, x2, y2) {
        const lineElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        lineElement.setAttribute('x1', x1);
        lineElement.setAttribute('y1', y1);
        lineElement.setAttribute('x2', x2);
        lineElement.setAttribute('y2', y2);
        return lineElement;
    }
    _createSVGPolygon(points) {
        const polygonElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygonElement.setAttribute('points', points.map(p => `${p.x},${p.y}`).join(' '));
        return polygonElement;
    }
    _createSVGPolyline(points) {
        const polylineElement = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        polylineElement.setAttribute('points', points.map(p => `${p.x},${p.y}`).join(' '));
        return polylineElement;
    }
    _createSVGDefs() {
        const defsElement = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        return defsElement;
    }
    _createSVGGradient() {
        const gradientElement = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        return gradientElement;
    }
    _createSVGPattern() {
        const patternElement = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
        return patternElement;
    }
    _createSVGPatternWithAttributes(id, width, height) {
        const patternElement = this._createSVGPattern();
        patternElement.setAttribute('id', id);
        patternElement.setAttribute('width', width);
        patternElement.setAttribute('height', height);
        return patternElement;
    }
    _createSVGPatternWithTransform(transform) {
        const patternElement = this._createSVGPattern();
        patternElement.setAttribute('transform', transform);
        return patternElement;
    }
    _createSVGPatternWithViewBox(viewBox) {
        const patternElement = this._createSVGPattern();
        patternElement.setAttribute('viewBox', viewBox);
        return patternElement;
    }
    _createSVGPatternWithPreserveAspectRatio(preserveAspectRatio) {
        const patternElement = this._createSVGPattern();
        patternElement.setAttribute('preserveAspectRatio', preserveAspectRatio);
        return patternElement;
    }
    _createSVGPatternWithPatternUnits(patternUnits) {
        const patternElement = this._createSVGPattern();
        patternElement.setAttribute('patternUnits', patternUnits);
        return patternElement;
    }
    _createSVGPatternWithPatternContentUnits(patternContentUnits) {
        const patternElement = this._createSVGPattern();
        patternElement.setAttribute('patternContentUnits', patternContentUnits);
        return patternElement;
    }
    _createSVGPatternWithPatternTransform(patternTransform) {
        const patternElement = this._createSVGPattern();
        patternElement.setAttribute('patternTransform', patternTransform);
        return patternElement;
    }
}
export class ArtboardTool extends Tool {
    constructor(eventManager) {
        super(eventManager, 'artboard');
        this._cursor = 'crosshair';
    }
    handleStart(x, y, event) {
        super.handleStart(x, y, event);
        const width = 100;
        const height = 100;
        this._createArtboard(x, y, width, height);
    }
    handleMove(x, y, event) {
        super.handleMove(x, y, event);
        if (this._tempElement) {
            const width = x - this._startPosition.x;
            const height = y - this._startPosition.y;
            this._updateTempElement({
                width,
                height
            });
        }

    }
    handleEnd(x, y, event) {
        super.handleEnd(x, y, event);
        if (this._tempElement) {
            const width = x - this._startPosition.x;
            const height = y - this._startPosition.y;
            if (width > 0 && height > 0) {
                const element = this._createElement(
                    'artboard',
                    'rect',
                    this._tempElement.x,
                    this._tempElement.y,
                    width,
                    height,
                    {
                        ...this._tempElement,
                        isTemp: false,
                        ...this._getShapeData(this._startPosition.x, this._startPosition.y, x, y)
                    }
                );
                this._eventManager.emit('element:add-to-layer', element.serialize());
            }
        }
        this._cleanupTempElement();
    }
    handleKeyDown(event) {
        if (event.key === 'Escape') {
            this._cleanup();
            this._eventManager.emit('tool:cancel-current');
        }
    }
    _cleanup() {
        super._cleanup();
        // Schoonmaakcode voor artboard tool
    }
    _createArtboard(x, y, width, height) {
        const artboardElement = new TerrainElement(
            'artboard',
            'rect',
            x, y, width, height,
            { isTemp: true }
        );
        this._eventManager.emit('element:create', artboardElement.serialize());
        return artboardElement;
    }
    _getShapeCategory() {
        return 'rect';
    }
    _getDefaultStyle() {
        return {
            stroke: '#000000',
            strokeWidth: 1,
            fill: '#ffffff'
        };
    }
    _calculateDimensions(x1, y1, x2, y2) {
        return {
            x: Math.min(x1, x2),
            y: Math.min(y1, y2),
            width: Math.abs(x2 - x1),
            height: Math.abs(y2 - y1)
        };
    }
    _getShapeData(x1, y1, x2, y2) {
        return {
            x: Math.min(x1, x2),
            y: Math.min(y1, y2),
            width: Math.abs(x2 - x1),
            height: Math.abs(y2 - y1)

        };
    }
    _calculateDimensions(x1, y1, x2, y2) {
        return {
            x: Math.min(x1, x2),
            y: Math.min(y1, y2),
            width: Math.abs(x2 - x1),
            height: Math.abs(y2 - y1)
        };
    }
}
export class UngroupTool extends Tool {
    constructor(eventManager) {
        super(eventManager, 'ungroup');
        this._cursor = 'pointer';
    }

    handleStart(x, y, event) {
        super.handleStart(x, y, event);
        const element = this._eventManager.elementManager.getElementAt(x, y);
        if (element?.type === 'group') {
            this._eventManager.emit('group:ungroup', { groupId: element.id });
        }
    }
}
export class GroupTool extends Tool {
    constructor(eventManager) {
        super(eventManager, 'group');
        this._cursor = 'pointer';

        this._selectedElements = null;
        this._groupId = null;
    }
    
    handleStart(x, y, event) {
        super.handleStart(x, y, event);
        const element = this._eventManager.elementManager.getElementAt(x, y);
        if (element?.type === 'group') {
            this._eventManager.emit('group:ungroup', { groupId: element.id });
        }
    }
}
export class SelectTool extends Tool {
    constructor(eventManager) {
        super(eventManager, 'select');
        this._cursor = 'pointer';
        this._selectionBox = null;
        this._dragStart = null;
    }

    handleStart(x, y, event) {
        super.handleStart(x, y, event);
        
        if (event.shiftKey) {
            // Multi-select mode
            this._selectionBox = { x1: x, y1: y, x2: x, y2: y };
            this._eventManager.emit('selection:start-box', { ...this._selectionBox });
        } else {
            // Single select
            const element = this._eventManager.elementManager.getElementAt(x, y);
            if (element) {
                this._eventManager.emit('element:select', element.serialize());
                this._dragStart = { element, x, y };
            } else {
                this._eventManager.emit('element:deselect-all');
            }
        }
    }

    handleMove(x, y, event) {
        super.handleMove(x, y, event);
        
        if (this._selectionBox && event.buttons === 1) {
            this._selectionBox.x2 = x;
            this._selectionBox.y2 = y;
            this._eventManager.emit('selection:update-box', { ...this._selectionBox });
        } else if (this._dragStart && event.buttons === 1) {
            const dx = x - this._dragStart.x;
            const dy = y - this._dragStart.y;
            this._eventManager.emit('element:drag', {
                element: this._dragStart.element.serialize(),
                dx,
                dy
            });
            this._dragStart.x = x;
            this._dragStart.y = y;
        }
    }

    handleEnd(x, y, event) {
        if (this._selectionBox) {
            const elements = this._eventManager.elementManager.getElementsInArea(
                this._selectionBox.x1, this._selectionBox.y1,
                this._selectionBox.x2, this._selectionBox.y2
            );
            this._eventManager.emit('elements:select-multiple', elements.map(el => el.serialize()));
            this._selectionBox = null;
            this._eventManager.emit('selection:end-box');
        }
        this._dragStart = null;
        super.handleEnd(x, y, event);
    }

    _cleanup() {
        super._cleanup();
        this._selectionBox = null;
        this._dragStart = null;
    }
}
export class TransformTool extends Tool {
    constructor(eventManager) {
        super(eventManager, 'transform');
        this._cursor = 'move';
        this._transformHandle = null;
        this._selectedElement = null;
        this._startTransform = null;
    }

    handleStart(x, y, event) {
        super.handleStart(x, y, event);
        const element = this._eventManager.elementManager.getElementAt(x, y);
        
        if (element) {
            this._selectedElement = element;
            this._transformHandle = this._getHandleAt(x, y, element);
            this._startTransform = {
                x: element.x,
                y: element.y,
                width: element.width,
                height: element.height,
                rotation: element.rotation || 0
            };
        }
    }

    handleMove(x, y, event) {
        super.handleMove(x, y, event);
        if (this._selectedElement && this._transformHandle && event.buttons === 1) {
            const transform = this._calculateTransform(x, y);
            this._eventManager.emit('element:transform', {
                id: this._selectedElement.id,
                ...transform
            });
        }
    }

    handleEnd(x, y, event) {
        super.handleEnd(x, y, event);
        this._selectedElement = null;
        this._transformHandle = null;
        this._startTransform = null;
    }

    _getHandleAt(x, y, element) {
        // Implement handle detection logic
        return 'scale'; // Possible values: 'move', 'scale', 'rotate'
    }

    _calculateTransform(x, y) {
        // Implement transform logic based on handle type
        return {
            x: x,
            y: y
        };
    }
}
export class SliceTool extends Tool {
    constructor(eventManager) {
        super(eventManager, 'slice');
        this._cursor = 'crosshair';
        this._sliceArea = null;
    }
    handleStart(x, y, event) {
        super.handleStart(x, y, event);
        const snapped = this._snapToGrid(x, y);
        
        this._sliceArea = {
            x1: snapped.x,
            y1: snapped.y,
            x2: snapped.x,
            y2: snapped.y
        };
        
        this._eventManager.emit('slice:start', { ...this._sliceArea });
    }
    handleMove(x, y, event) {
        super.handleMove(x, y, event);
        
        if (this._sliceArea && event.buttons === 1) {
            const snapped = this._snapToGrid(x, y);
            this._sliceArea.x2 = snapped.x;
            this._sliceArea.y2 = snapped.y;
            
            this._eventManager.emit('slice:update', { ...this._sliceArea });
        }
    }
    handleEnd(x, y, event) {
        super.handleEnd(x, y, event);
        
        if (this._sliceArea) {
            this._eventManager.emit('slice:end', { ...this._sliceArea });
            this._sliceArea = null;
        }
    }
    _cleanup() {
        super._cleanup();
        this._sliceArea = null;
    }
    _getShapeCategory() {
        return 'rect';
    }
    _getDefaultStyle() {
        return {
            stroke: '#000000',
            strokeWidth: 1,
            fill: 'none'
        };
    }
    _calculateDimensions(x1, y1, x2, y2) {
        return {
            x: Math.min(x1, x2),
            y: Math.min(y1, y2),
            width: Math.abs(x2 - x1),
            height: Math.abs(y2 - y1)
        };
    }
    _getShapeData(x1, y1, x2, y2) {
        return {
            x: Math.min(x1, x2),
            y: Math.min(y1, y2),
            width: Math.abs(x2 - x1),
            height: Math.abs(y2 - y1)
        };
        
    }
    _getShapeArea(x1, y1, x2, y2) {
        const dimensions = this._getShapeData(x1, y1, x2, y2);
        return dimensions.width * dimensions.height;
    }
    _getShapePerimeter(x1, y1, x2, y2) {
        const dimensions = this._getShapeData(x1, y1, x2, y2);
        return 2 * (dimensions.width + dimensions.height);
    }
    _getShapeCenter(x1, y1, x2, y2) {
        const dimensions = this._getShapeData(x1, y1, x2, y2);
        return {
            x: dimensions.x + dimensions.width / 2,
            y: dimensions.y + dimensions.height / 2
        };
        
    }
    _getShapeRadius(x1, y1, x2, y2) {
        const dimensions = this._getShapeData(x1, y1, x2, y2);
        return Math.sqrt(Math.pow(dimensions.width / 2, 2) + Math.pow(dimensions.height / 2, 2));
        
    }
    _getShapeAngle(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.atan2(dy, dx) * (180 / Math.PI); // Convert to degrees
        
    }
    _getShapeDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        
    }
    _getShapeMidpoint(x1, y1, x2, y2) {
        return {
            x: (x1 + x2) / 2,
            y: (y1 + y2) / 2
        };
        
    }
    _getShapeBoundingBox(x1, y1, x2, y2) {
        return {
            x: Math.min(x1, x2),
            y: Math.min(y1, y2),
            width: Math.abs(x2 - x1),
            height: Math.abs(y2 - y1)
        };
        
    }
    _getShapeArea(x1, y1, x2, y2) {
        const dimensions = this._getShapeBoundingBox(x1, y1, x2, y2);
        return dimensions.width * dimensions.height;
    }
    _getShapePerimeter(x1, y1, x2, y2) {
        const dimensions = this._getShapeBoundingBox(x1, y1, x2, y2);
        return 2 * (dimensions.width + dimensions.height);
    }
}
export class MeasureTool extends Tool {
    constructor(eventManager) {
        super(eventManager, 'measure');
        this._cursor = 'crosshair';
        this._currentMeasurement = null;
        this._measurements = [];
        this._tempPoints = [];
    }

    handleStart(x, y, event) {
        super.handleStart(x, y, event);
        const snapped = this._snapToGrid(x, y);
        
        if (!this._currentMeasurement) {
            this._currentMeasurement = {
                points: [snapped],
                distances: [],
                totalLength: 0
            };
            
            this._createTempElement(
                'measurement',
                'path',
                snapped.x, snapped.y,
                0, 0,
                {
                    stroke: '#ff0000',
                    strokeWidth: 1,
                    dashArray: [5, 3],
                    isTemp: true
                }
            );
        } else {
            const lastPoint = this._currentMeasurement.points[this._currentMeasurement.points.length - 1];
            const distance = this._calculateDistance(lastPoint.x, lastPoint.y, snapped.x, snapped.y);
            
            this._currentMeasurement.points.push(snapped);
            this._currentMeasurement.distances.push(distance);
            this._currentMeasurement.totalLength += distance;
            
            this._updateMeasurementPath();
        }
    }

    handleDoubleClick(x, y, event) {
        if (this._currentMeasurement && this._currentMeasurement.points.length >= 2) {
            this._measurements.push({...this._currentMeasurement});
            this._eventManager.emit('measurement:add', {
                ...this._currentMeasurement,
                id: `measure-${Date.now()}`
            });
            this._cleanup();
        }
    }

    handleMove(x, y, event) {
        super.handleMove(x, y, event);
        
        if (this._currentMeasurement && this._currentMeasurement.points.length > 0) {
            const snapped = this._snapToGrid(x, y);
            this._tempPoints = [...this._currentMeasurement.points, snapped];
            this._updateMeasurementPath();
        }
    }

    _updateMeasurementPath() {
        if (this._tempElement && this._tempPoints) {
            this._updateTempElement({
                pathData: this._createPathData(this._tempPoints),
                measurementText: this._getMeasurementText()
            });
        }
    }

    _createPathData(points) {
        if (points.length === 0) return '';
        return `M${points[0].x},${points[0].y} ` + 
               points.slice(1).map(p => `L${p.x},${p.y}`).join(' ');
    }

    _getMeasurementText() {
        if (!this._currentMeasurement || this._tempPoints.length < 2) return '';
        
        const lastFixed = this._currentMeasurement.points[this._currentMeasurement.points.length - 1];
        const currentTemp = this._tempPoints[this._tempPoints.length - 1];
        const tempDistance = this._calculateDistance(lastFixed.x, lastFixed.y, currentTemp.x, currentTemp.y);
        
        return `Total: ${this._currentMeasurement.totalLength.toFixed(2)} (+${tempDistance.toFixed(2)})`;
    }

    _cleanup() {
        super._cleanup();
        this._currentMeasurement = null;
        this._tempPoints = [];
    }
}
export class EraserTool extends Tool {
    constructor(eventManager) {
        super(eventManager, 'eraser');
        this._cursor = 'url("assets/cursors/eraser.cur"), auto';
        this._erasedElements = [];
    }

    handleStart(x, y, event) {
        super.handleStart(x, y, event);
        this._erasing = true;
        this._eraseAt(x, y);
    }

    handleMove(x, y, event) {
        super.handleMove(x, y, event);
        if (this._erasing && event.buttons === 1) {
            this._eraseAt(x, y);
        }
    }

    handleEnd(x, y, event) {
        super.handleEnd(x, y, event);
        if (this._erasedElements.length > 0) {
            this._eventManager.emit('elements:remove', {
                elements: this._erasedElements.map(el => el.serialize())
            });
            this._erasedElements = [];
        }
        this._erasing = false;
    }

    _eraseAt(x, y) {
        const element = this._eventManager.elementManager.getElementAt(x, y);
        if (element && !this._erasedElements.includes(element)) {
            this._erasedElements.push(element);
            this._eventManager.emit('element:hide-temp', { id: element.id });
        }
    }
}
export class PaintTool extends Tool {
    constructor(eventManager) {
        super(eventManager, 'paint');
        this._cursor = 'url("assets/cursors/paint-bucket.cur"), auto';
        this._currentColor = '#000000';
        this._currentFill = '#ffffff';
        this._size = 10;
    }

    handleStart(x, y, event) {
        super.handleStart(x, y, event);
        const element = this._eventManager.elementManager.getElementAt(x, y);
        
        if (element) {
            if (event.altKey) {
                // Pick color
                this._pickColors(element);
            } else {
                // Apply color
                this._applyColors(element, event);
            }
        }
    }

    _pickColors(element) {
        this._currentColor = element.stroke || this._currentColor;
        this._currentFill = element.fill || this._currentFill;
        this._eventManager.emit('tool:color-changed', {
            stroke: this._currentColor,
            fill: this._currentFill
        });
    }

    _applyColors(element, event) {
        const updates = {};
        
        if (event.shiftKey) {
            updates.fill = this._currentFill;
        } else {
            updates.stroke = this._currentColor;
            updates.strokeWidth = this._size;
        }
        
        this._eventManager.emit('element:update', {
            id: element.id,
            updates
        });
    }

    setColor(color, isFill = false) {
        if (isFill) {
            this._currentFill = color;
        } else {
            this._currentColor = color;
        }
    }

    setSize(size) {
        this._size = Math.max(1, Math.min(50, size));
    }
}
export class GradientTool extends Tool {
    constructor(eventManager) {
        super(eventManager, 'gradient');
        this._cursor = 'crosshair';
        this._gradientStops = [
            { color: '#000000', position: 0 },
            { color: '#ffffff', position: 100 }
        ];
    }

    handleStart(x, y, event) {
        super.handleStart(x, y, event);
        const element = this._eventManager.elementManager.getElementAt(x, y);
        
        if (element) {
            const gradientId = `gradient-${Date.now()}`;
            const gradientDef = {
                id: gradientId,
                type: event.shiftKey ? 'radial' : 'linear',
                stops: [...this._gradientStops]
            };
            
            this._eventManager.emit('gradient:create', gradientDef);
            
            this._eventManager.emit('element:update', {
                id: element.id,
                updates: {
                    fill: `url(#${gradientId})`,
                    gradient: gradientDef
                }
            });
        }
    }

    setStops(stops) {
        this._gradientStops = [...stops].sort((a, b) => a.position - b.position);
    }
}
export class ShapeTool extends Tool {
    constructor(eventManager, name, shapeType) {
        super(eventManager, name);
        this._shapeType = shapeType;
        this._cursor = 'crosshair';
        this._minSize = 5;
    }

    handleStart(x, y, event) {
        super.handleStart(x, y, event);
        const snapped = this._snapToGrid(x, y);
        
        this._createTempElement(
            this._shapeType,
            this._getShapeCategory(),
            snapped.x, snapped.y,
            0, 0,
            this._getDefaultStyle()
        );
    }

    handleMove(x, y, event) {
        super.handleMove(x, y, event);
        
        if (this._tempElement && event.buttons === 1) {
            const snapped = this._snapToGrid(x, y);
            const start = this._snapToGrid(this._startPosition.x, this._startPosition.y);
            
            const { x: elemX, y: elemY, width, height } = this._calculateDimensions(
                start.x, start.y, 
                snapped.x, snapped.y
            );
            
            this._updateTempElement({
                x: elemX,
                y: elemY,
                width,
                height,
                ...this._getShapeData(start.x, start.y, snapped.x, snapped.y)
            });
        }
    }

    handleEnd(x, y, event) {
        if (this._tempElement) {
            const snapped = this._snapToGrid(x, y);
            const start = this._snapToGrid(this._startPosition.x, this._startPosition.y);
            
            const { width, height } = this._calculateDimensions(
                start.x, start.y, 
                snapped.x, snapped.y
            );
            
            if (width >= this._minSize && height >= this._minSize) {
                const element = this._createElement(
                    this._shapeType,
                    this._getShapeCategory(),
                    this._tempElement.x,
                    this._tempElement.y,
                    width,
                    height,
                    {
                        ...this._tempElement,
                        isTemp: false,
                        ...this._getShapeData(start.x, start.y, snapped.x, snapped.y)
                    }
                );
                this._eventManager.emit('element:add-to-layer', element.serialize());
            }
        }
        super.handleEnd(x, y, event);
    }

    /* ------------------------ Abstract Methods ------------------------ */
    _getShapeCategory() {
        throw new Error('ShapeTool subclasses must implement _getShapeCategory');
    }

    _getDefaultStyle() {
        return {
            stroke: '#000000',
            strokeWidth: 1,
            fill: '#ffffff'
        };
    }

    _calculateDimensions(x1, y1, x2, y2) {
        return {
            x: Math.min(x1, x2),
            y: Math.min(y1, y2),
            width: Math.abs(x2 - x1),
            height: Math.abs(y2 - y1)
        };
    }

    _getShapeData(x1, y1, x2, y2) {
        return {};
    }
}
export class RectangleTool extends ShapeTool {
    constructor(eventManager) {
        super(eventManager, 'rectangle', 'rectangle');
    }

    _getShapeCategory() {
        return 'rect';
    }
}
export class CircleTool extends ShapeTool {
    constructor(eventManager) {
        super(eventManager, 'circle', 'circle');
    }

    _getShapeCategory() {
        return 'ellipse';
    }

    _calculateDimensions(x1, y1, x2, y2) {
        const radius = this._calculateDistance(x1, y1, x2, y2);
        return {
            x: x1 - radius,
            y: y1 - radius,
            width: radius * 2,
            height: radius * 2
        };
    }

    _getShapeData(x1, y1, x2, y2) {
        const radius = this._calculateDistance(x1, y1, x2, y2);
        return {
            cx: x1,
            cy: y1,
            rx: radius,
            ry: radius
        };
    }
}
export class LineTool extends ShapeTool {
    constructor(eventManager) {
        super(eventManager, 'line', 'line');
        this._minSize = 1;
    }

    _getShapeCategory() {
        return 'path';
    }

    _getDefaultStyle() {
        return {
            stroke: '#000000',
            strokeWidth: 2,
            fill: 'none'
        };
    }

    _getShapeData(x1, y1, x2, y2) {
        return {
            pathData: this._createPathData(x1, y1, x2, y2)
        };
    }

    _createPathData(x1, y1, x2, y2) {
        return `M${x1},${y1} L${x2},${y2}`;
    }
}
export class PolygonTool extends Tool {
    constructor(eventManager, sides = 0) {
        super(eventManager, sides ? `polygon-${sides}` : 'polygon');
        this._cursor = 'crosshair';
        this._points = [];
        this._isCreating = false;
        this._minPoints = sides || 3;
    }

    handleStart(x, y, event) {
        super.handleStart(x, y, event);
        const snapped = this._snapToGrid(x, y);
        
        if (!this._isCreating) {
            this._isCreating = true;
            this._points = [{ x: snapped.x, y: snapped.y }];
            
            this._createTempElement(
                this._name,
                'path',
                snapped.x, snapped.y,
                0, 0,
                {
                    stroke: '#000000',
                    strokeWidth: 1,
                    fill: '#ffffff',
                    isTemp: true,
                    points: this._points
                }
            );
        } else {
            this._points.push({ x: snapped.x, y: snapped.y });
            this._updatePolygon();
        }
    }

    handleDoubleClick(x, y, event) {
        if (this._isCreating && this._points.length >= this._minPoints) {
            const element = this._createElement(
                this._name,
                'path',
                0, 0, 0, 0,
                {
                    stroke: '#000000',
                    strokeWidth: 1,
                    fill: '#ffffff',
                    points: [...this._points],
                    pathData: this._createPathData(),
                    ...this._calculateBoundingBox()
                }
            );
            this._eventManager.emit('element:add-to-layer', element.serialize());
            this._cleanup();
        }
    }

    handleMove(x, y, event) {
        super.handleMove(x, y, event);
        
        if (this._isCreating && this._points.length > 0) {
            const snapped = this._snapToGrid(x, y);
            const tempPoints = [...this._points, { x: snapped.x, y: snapped.y }];
            this._updateTempElement({
                pathData: this._createPathData(tempPoints),
                ...this._calculateBoundingBox(tempPoints)
            });
        }
    }

    handleKeyDown(event) {
        if (event.key === 'Escape' && this._isCreating) {
            this._cleanup();
            this._eventManager.emit('tool:cancel-current');
        }
    }

    _updatePolygon() {
        if (this._tempElement) {
            this._updateTempElement({
                pathData: this._createPathData(),
                ...this._calculateBoundingBox()
            });
        }
    }

    _createPathData(points = this._points) {
        if (points.length === 0) return '';
        const first = points[0];
        let path = `M${first.x},${first.y}`;
        
        for (let i = 1; i < points.length; i++) {
            path += ` L${points[i].x},${points[i].y}`;
        }
        
        if (points.length >= 3) {
            path += ' Z';
        }
        
        return path;
    }

    _calculateBoundingBox(points = this._points) {
        if (points.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
        
        const xs = points.map(p => p.x);
        const ys = points.map(p => p.y);
        
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }

    _cleanup() {
        super._cleanup();
        this._points = [];
        this._isCreating = false;
    }
}
export class StarTool extends PolygonTool {
    constructor(eventManager, points = 5) {
        super(eventManager);
        this._name = 'star';
        this._points = points;
    }

    _createStarPoints(centerX, centerY, outerR, innerR) {
        const points = [];
        for (let i = 0; i < this._points * 2; i++) {
            const angle = (Math.PI / this._points) * i - Math.PI / 2;
            const r = i % 2 === 0 ? outerR : innerR;
            points.push({
                x: centerX + r * Math.cos(angle),
                y: centerY + r * Math.sin(angle)
            });
        }
        return points;
    }
}
export class CustomTool extends ShapeTool {
    constructor(eventManager) {
        super(eventManager, 'custom', 'custom-shape');
    }

    _getShapeCategory() {
        return 'path';
    }

    _getShapeData(x1, y1, x2, y2) {
        return {
            pathData: this._createCustomPath(x1, y1, x2, y2)
        };
    }
    
    _createCustomPath(x1, y1, x2, y2) {
        return `M${x1},${y1} L${x2},${y2} Z`;
    }
}
export class TextTool extends Tool {
    constructor(eventManager) {
        super(eventManager, 'text');
        this._cursor = 'text';
        this._textInput = null;
    }

    handleStart(x, y, event) {
        super.handleStart(x, y, event);
        
        this._cleanup(); // Remove any existing text input
        
        this._textInput = document.createElement('div');
        this._textInput.contentEditable = true;
        Object.assign(this._textInput.style, {
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
            minWidth: '100px',
            border: '1px dashed #000',
            padding: '2px',
            outline: 'none',
            backgroundColor: 'white',
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px'
        });
        
        document.getElementById('canvas-container').appendChild(this._textInput);
        this._textInput.focus();
        
        this._textInput.addEventListener('blur', () => this._finalizeText());
        this._textInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this._finalizeText();
            } else if (e.key === 'Escape') {
                this._cancelText();
            }
        });
    }

    _finalizeText() {
        if (this._textInput && this._textInput.textContent.trim()) {
            const rect = this._textInput.getBoundingClientRect();
            const canvasRect = this._canvas.getBoundingClientRect();
            
            const element = this._createElement(
                'text',
                'text',
                rect.left - canvasRect.left,
                rect.top - canvasRect.top,
                rect.width,
                rect.height,
                {
                    text: this._textInput.textContent,
                    color: '#000000',
                    fontSize: 12,
                    fontFamily: 'Arial'
                }
            );
            
            this._eventManager.emit('element:add-to-layer', element.serialize());
        }
        this._cleanup();
    }

    _cancelText() {
        this._cleanup();
    }

    _cleanup() {
        super._cleanup();
        if (this._textInput) {
            this._textInput.remove();
            this._textInput = null;
        }
    }

    get _canvas() {
        return document.getElementById('main-canvas');
    }
}
export class SymbolTool extends Tool {
    constructor(eventManager, symbolLibrary) {
        super(eventManager, 'symbol');
        this._cursor = 'pointer';
        this._symbolLibrary = symbolLibrary;
        this._selectedSymbol = null;
    }

    handleStart(x, y, event) {
        super.handleStart(x, y, event);
        const element = this._eventManager.elementManager.getElementAt(x, y);
        if (element?.type === 'symbol') {
            this._selectedSymbol = element;
            this._eventManager.emit('symbol:select', { symbolId: element.id });
        } else {
            this._selectedSymbol = null;
            this._eventManager.emit('symbol:deselect-all');
        }
    }
    
}
export class TextPathTool extends Tool {
    constructor(eventManager) {
        super(eventManager, 'text-path');
        this._cursor = 'text';
        this._pathElement = null;
    }

    handleStart(x, y, event) {
        super.handleStart(x, y, event);
        const element = this._eventManager.elementManager.getElementAt(x, y);
        
        if (element?.shape === 'path') {
            this._pathElement = element;
            this._createTextInput();
        }
    }

    _createTextInput() {
        this._cleanupTextInput();
        
        this._textInput = document.createElement('div');
        this._textInput.contentEditable = true;
        Object.assign(this._textInput.style, {
            position: 'absolute',
            left: '20px',
            top: '20px',
            width: '200px',
            border: '1px solid #000',
            padding: '5px'
        });
        
        document.body.appendChild(this._textInput);
        this._textInput.focus();
        
        this._textInput.addEventListener('blur', () => this._finalizeTextPath());
    }

    _finalizeTextPath() {
        if (this._textInput?.textContent && this._pathElement) {
            const textElement = this._createElement(
                'text-path',
                'text',
                this._pathElement.x,
                this._pathElement.y,
                this._pathElement.width,
                this._pathElement.height,
                {
                    text: this._textInput.textContent,
                    pathId: this._pathElement.id,
                    fill: '#000000'
                }
            );
            
            this._eventManager.emit('element:add-to-layer', textElement.serialize());
        }
        this._cleanup();
    }

    _cleanup() {
        super._cleanup();
        this._cleanupTextInput();
        this._pathElement = null;
    }

    _cleanupTextInput() {
        if (this._textInput) {
            this._textInput.remove();
            this._textInput = null;
        }
    }
}

