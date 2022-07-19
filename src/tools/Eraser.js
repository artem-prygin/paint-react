import Brush from './Brush.js';
import { sendWebSocket } from '../api/websocket.js';

export default class Eraser extends Brush {
    constructor(mouseDown) {
        super(mouseDown);
        super.listen();
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            const msg = {
                method: 'draw',
                figure: {
                    type: 'eraser',
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                },
            };
            this.draw(msg.figure.x, msg.figure.y);
            sendWebSocket(msg);
        }
    }

    mouseDownHandler(e) {
        super.mouseDownHandler(e);
    }

    mouseUpHandler(e) {
        super.mouseUpHandler(e);
    }

    draw(x, y) {
        const currentStrokeStyle = this.ctx.strokeStyle;
        this.ctx.lineTo(x, y);
        this.ctx.strokeStyle = '#fff';
        this.ctx.stroke();
        this.ctx.strokeStyle = currentStrokeStyle;
    }

    static staticDraw(ctx, figure) {
        const currentStrokeStyle = ctx.strokeStyle;
        ctx.lineTo(figure.x, figure.y);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = figure.lineWidth;
        ctx.stroke();
        ctx.strokeStyle = currentStrokeStyle;
    }
}
