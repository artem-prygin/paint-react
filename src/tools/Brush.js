import Tool from './Tool.js';

export default class Brush extends Tool {
    constructor(canvas, socket, sessionID) {
        super(canvas, socket, sessionID);
        this.listen();
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            const msg = {
                method: 'draw',
                sessionID: this.sessionID,
                figure: {
                    type: 'brush',
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                },
            };
            this.socket.send(JSON.stringify(msg));
        }
    }

    mouseDownHandler(e) {
        this.mouseDown = true;
        this.ctx.beginPath();
        this.ctx.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop);
    }

    mouseUpHandler(e) {
        this.mouseDown = false;
        const msg = {
            method: 'draw',
            sessionID: this.sessionID,
            figure: {
                type: 'finish',
            },
        };
        this.socket.send(JSON.stringify(msg));
    }

    static draw(ctx, figure) {
        ctx.lineTo(figure.x, figure.y);
        ctx.stroke();
    }
}
