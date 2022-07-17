import Tool from './Tool.js';

export default class Rect extends Tool {
    constructor(canvas, socket, sessionID, mouseDown) {
        super(canvas, socket, sessionID, mouseDown);
        super.listen();
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            this.currentX = e.pageX - e.target.offsetLeft;
            this.currentY = e.pageY - e.target.offsetTop;
            this.width = this.currentX - this.startX;
            this.height = this.currentY - this.startY;
            this.draw();
        }
    }

    mouseDownHandler(e) {
        super.mouseDownHandler();
        this.mouseDown = true;
        this.ctx.beginPath();
        this.startX = e.pageX - e.target.offsetLeft;
        this.startY = e.pageY - e.target.offsetTop;
        this.savedImg = this.canvas.toDataURL();
    }

    mouseUpHandler(e) {
        this.mouseDown = false;

        if (this.currentX == null || this.currentY == null) {
            return;
        }

        super.mouseUpHandler();

        const msg = {
            method: 'draw',
            sessionID: this.sessionID,
            figure: {
                type: 'rect',
                x: this.startX,
                y: this.startY,
                width: this.width,
                height: this.height,
                fillStyle: this.ctx.fillStyle,
                strokeStyle: this.ctx.strokeStyle,
                lineWidth: this.ctx.lineWidth,
            },
        };
        this.socket.send(JSON.stringify(msg));
        this.dropCurrentXY();
    }

    draw() {
        const img = new Image();
        img.src = this.savedImg;
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx.beginPath();
            this.ctx.rect(this.startX, this.startY, this.width, this.height);
            this.ctx.fill();
            this.ctx.stroke();
        };
    }

    static staticDraw(ctx, figure) {
        ctx.fillStyle = figure.fillStyle;
        ctx.strokeStyle = figure.strokeStyle;
        ctx.lineWidth = figure.lineWidth;
        ctx.beginPath();
        ctx.rect(figure.x, figure.y, figure.width, figure.height);
        ctx.fill();
        ctx.stroke();
    }
}
