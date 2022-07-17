import Tool from './Tool.js';

export default class Brush extends Tool {
    constructor(canvas, socket, sessionID, mouseDown) {
        super(canvas, socket, sessionID, mouseDown);
        super.listen();
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
        super.mouseDownHandler();
        this.mouseDown = true;
        this.ctx.beginPath();
        this.ctx.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop);
    }

    mouseUpHandler(e) {
        this.mouseDown = false;
        super.mouseUpHandler();

        const msg = {
            method: 'draw',
            sessionID: this.sessionID,
            figure: {
                type: 'finish',
            },
        };
        this.socket.send(JSON.stringify(msg));
    }

    static staticDraw(ctx, figure) {
        ctx.lineTo(figure.x, figure.y);
        ctx.stroke();
    }
}
