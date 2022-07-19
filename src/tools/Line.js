import Tool from './Tool.js';
import { sendWebSocket } from '../api/websocket.js';
import canvasState from '../store/canvasState.js';

export default class Line extends Tool {
    constructor(mouseDown) {
        super(mouseDown);
        super.listen();
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            this.currentX = e.pageX - e.target.offsetLeft;
            this.currentY = e.pageY - e.target.offsetTop;
            this.draw();
        }
    }

    mouseDownHandler(e) {
        super.mouseDownHandler();
        this.mouseDown = true;
        this.ctx.beginPath();
        this.startX = e.pageX - e.target.offsetLeft;
        this.startY = e.pageY - e.target.offsetTop;
        this.savedImg = canvasState.canvas.toDataURL();
    }

    mouseUpHandler(e) {
        this.mouseDown = false;

        if (this.currentX == null || this.currentY == null) {
            return;
        }

        super.mouseUpHandler();

        const msg = {
            method: 'draw',
            figure: {
                type: 'line',
                startX: this.startX,
                startY: this.startY,
                x: this.currentX,
                y: this.currentY,
                fillStyle: this.ctx.fillStyle,
                strokeStyle: this.ctx.strokeStyle,
                lineWidth: this.ctx.lineWidth,
            },
        };

        sendWebSocket(msg);
        this.dropCurrentXY();
    }

    draw() {
        const img = new Image();
        img.src = this.savedImg;
        img.onload = () => {
            if (this.currentX == null || this.currentY == null) {
                return;
            }

            this.ctx.clearRect(0, 0, canvasState.canvas.width, canvasState.canvas.height);
            this.ctx.drawImage(img, 0, 0, canvasState.canvas.width, canvasState.canvas.height);
            this.ctx.beginPath();
            this.ctx.moveTo(this.startX, this.startY);
            this.ctx.lineTo(this.currentX, this.currentY);
            this.ctx.stroke();
        }
    }

    static staticDraw(ctx, figure) {
        ctx.beginPath();
        ctx.moveTo(figure.startX, figure.startY);
        ctx.lineTo(figure.x, figure.y);
        ctx.strokeStyle = figure.strokeStyle;
        ctx.lineWidth = figure.lineWidth;
        ctx.stroke();
    }
}
