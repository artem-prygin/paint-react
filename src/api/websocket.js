import canvasState from '../store/canvasState.js';
import toolState from '../store/toolState.js';
import Brush from '../tools/Brush.js';
import Rect from '../tools/Rect.js';
import Circle from '../tools/Circle.js';
import Eraser from '../tools/Eraser.js';
import Line from '../tools/Line.js';

const WS_LOCALHOST = 'ws://localhost:5000/';
const WS_HOST = process.env.NODE_ENV === 'production'
    ? location.origin.replace(/^http/, 'ws')
    : WS_LOCALHOST;

export const openWebSocket = (canvas, sessionID) => {
    const ws = new WebSocket(WS_HOST);
    canvasState.setSocket(ws);
    toolState.setTool(new Brush(canvas, ws, sessionID));

    ws.onopen = () => {
        const data = {
            sessionID,
            username: canvasState.username,
            method: 'connection',
        };

        const pingPong = setInterval(() => {
            if (ws.readyState !== 1) {
                clearInterval(pingPong);
                return;
            }

            ws.send('1');
        }, 10000);

        ws.send(JSON.stringify(data));
    };

    wsOnMessage(ws, canvas);

    return ws;
}

const wsOnMessage = (ws, canvas) => {
    return ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);

        switch (msg.method) {
            case 'connection':
                console.log(`User ${msg.username} has logged in`);
                break;
            case 'draw':
                drawHandler(msg, canvas);
                break;
            default:
                break;
        }
    };
}

const drawHandler = (msg, canvas) => {
    const figure = msg.figure;
    const ctx = canvas.getContext('2d');

    switch (figure.type) {
        case 'brush':
            Brush.staticDraw(ctx, figure);
            break;
        case 'rect':
            Rect.staticDraw(ctx, figure);
            ctx.beginPath();
            break;
        case 'circle':
            Circle.staticDraw(ctx, figure);
            ctx.beginPath();
            break;
        case 'eraser':
            Eraser.staticDraw(ctx, figure);
            break;
        case 'line':
            Line.staticDraw(ctx, figure);
            break;
        case 'finish':
            ctx.beginPath();
            break;
        default:
            break;
    }
};
