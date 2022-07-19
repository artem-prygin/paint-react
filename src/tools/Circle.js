import Tool from './Tool.js';
import { sendWebSocket } from '../api/websocket.js';
import canvasState from '../store/canvasState.js';

export default class Circle extends Tool {
    constructor(mouseDown) {
        super(mouseDown);
        super.listen();
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            this.currentX = e.pageX - e.target.offsetLeft;
            this.currentY = e.pageY - e.target.offsetTop;
            const radius = Math.sqrt(Math.pow(this.currentX - this.startX, 2) + Math.pow(this.currentY - this.startY, 2));
            this.draw(radius);
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

        const radius = Math.sqrt(Math.pow(this.currentX - this.startX, 2) + Math.pow(this.currentY - this.startY, 2));
        const msg = {
            method: 'draw',
            figure: {
                type: 'circle',
                x: this.startX,
                y: this.startY,
                fillStyle: this.ctx.fillStyle,
                strokeStyle: this.ctx.strokeStyle,
                lineWidth: this.ctx.lineWidth,
                radius,
            },
        };
        sendWebSocket(msg);
        this.dropCurrentXY();
    }

    draw(radius) {
        const img = new Image();
        img.src = this.savedImg;
        img.onload = () => {
            this.ctx.clearRect(0, 0, canvasState.canvas.width, canvasState.canvas.height);
            this.ctx.drawImage(img, 0, 0, canvasState.canvas.width, canvasState.canvas.height);
            this.ctx.beginPath();
            this.ctx.arc(this.startX, this.startY, radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
        }
    }

    static staticDraw(ctx, figure) {
        ctx.fillStyle = figure.fillStyle;
        ctx.strokeStyle = figure.strokeStyle;
        ctx.lineWidth = figure.lineWidth;
        ctx.beginPath();
        ctx.arc(figure.x, figure.y, figure.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
}
