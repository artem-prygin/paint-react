import Brush from './Brush.js';

export default class Eraser extends Brush {
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
                    type: 'eraser',
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                },
            };
            this.socket.send(JSON.stringify(msg));
        }
    }

    mouseDownHandler(e) {
        super.mouseDownHandler(e);
    }

    mouseUpHandler(e) {
        super.mouseUpHandler(e);
    }

    static staticDraw(ctx, figure) {
        ctx.lineTo(figure.x, figure.y);
        ctx.strokeStyle = '#fff';
        ctx.stroke();
    }
}
