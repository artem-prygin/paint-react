import canvasState from '../store/canvasState.js';
import * as apiRequests from '../api/api.js';

export default class Tool {
    constructor(canvas, socket, sessionID) {
        this.canvas = canvas;
        this.socket = socket;
        this.sessionID = sessionID;
        this.mouseDown = false;
        this.ctx = canvas.getContext('2d');
        this.destroyEvents();
    }

    listen() {
        this.canvas.onmouseout = this.disableMouseDown.bind(this);
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    }

    mouseMoveHandler(e) {
    }

    mouseDownHandler(e) {
        const image = this.canvas.toDataURL();
        canvasState.pushToUndo(image);
    }

    mouseUpHandler(e) {
        const image = this.canvas.toDataURL();
        apiRequests.saveImage(image, this.sessionID);
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
        this.canvas.onmousemove = null;
        this.canvas.onmousedown = null;
        this.canvas.onmouseup = null;
    }

    dropCurrentXY() {
        this.currentX = null;
        this.currentY = null;
    }
}
