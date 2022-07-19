import canvasState from '../store/canvasState.js';
import generalState from '../store/generalState.js';
import * as apiRequests from '../api/api.js';

export default class Tool {
    constructor() {
        this.mouseDown = false;
        this.ctx = canvasState.canvas.getContext('2d');
        this.destroyEvents();
    }

    listen() {
        canvasState.canvas.onmouseout = this.disableMouseDown.bind(this);
        canvasState.canvas.onmousemove = this.mouseMoveHandler.bind(this);
        canvasState.canvas.onmousedown = this.mouseDownHandler.bind(this);
        canvasState.canvas.onmouseup = this.mouseUpHandler.bind(this);
    }

    mouseMoveHandler(e) {
    }

    mouseDownHandler(e) {
        const image = canvasState.canvas.toDataURL();
        canvasState.pushToUndo(image);
    }

    mouseUpHandler(e) {
        const image = canvasState.canvas.toDataURL();
        apiRequests.saveImage(image, generalState.sessionID);
    }

    set fillColor(color) {
        this.ctx.fillStyle = color;
    }

    set strokeColor(color) {
        this.ctx.strokeStyle = color;
    }

    set lineWidth(width) {
        this.ctx.lineWidth = width;
    }

    disableMouseDown() {
        this.mouseDown = false;
    }

    destroyEvents() {
        canvasState.canvas.onmousemove = null;
        canvasState.canvas.onmousedown = null;
        canvasState.canvas.onmouseup = null;
    }

    dropCurrentXY() {
        this.currentX = null;
        this.currentY = null;
    }
}
