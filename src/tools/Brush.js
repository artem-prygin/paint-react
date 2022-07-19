import Tool from './Tool.js';
import { sendWebSocket } from '../api/websocket.js';

export default class Brush extends Tool {
    constructor(mouseDown) {
        super(mouseDown);
        super.listen();
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            const msg = {
                method: 'draw',
                figure: {
                    type: 'brush',
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                },
            };
            this.draw(msg.figure.x, msg.figure.y);
            sendWebSocket(msg);
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
            figure: {
                type: 'finish',
            },
        };
        sendWebSocket(msg);
    }

    draw(x, y) {
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }

    static staticDraw(ctx, figure) {
        ctx.lineTo(figure.x, figure.y);
        ctx.strokeStyle = figure.strokeStyle;
        ctx.lineWidth = figure.lineWidth;
        ctx.stroke();
    }
}
