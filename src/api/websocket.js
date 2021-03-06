import canvasState from '../store/canvasState.js';
import generalState from '../store/generalState.js';
import Rect from '../tools/Rect.js';
import Circle from '../tools/Circle.js';
import Line from '../tools/Line.js';
import Brush from '../tools/Brush.js';
import Eraser from '../tools/Eraser.js';
import chatMessagesState from '../store/chatMessagesState.js';

const WS_LOCALHOST = 'ws://localhost:9999/';
const WS_HOST = process.env.NODE_ENV === 'production'
    ? location.origin.replace(/^http/, 'ws')
    : WS_LOCALHOST;

export const openWebSocket = (canvas, sessionID) => {
    const ws = new WebSocket(WS_HOST);
    generalState.setSocket(ws);

    const userID = `${generalState.username}_${sessionID}_${Math.round(Math.random() * 10000)}`;
    generalState.setUserID(userID);

    ws.onopen = () => {
        const data = {
            sessionID,
            userID,
            username: generalState.username,
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
};

const wsOnMessage = (ws, canvas) => {
    return ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);

        switch (msg.method) {
            case 'connection':
                console.log(`User ${msg.username} has logged in`);
                generalState.addUser(msg);
                break;
            case 'draw':
                drawHandler(msg, canvas);
                break;
            case 'pushToUndo':
                canvasState.pushToUndoFromSocket(msg.prevImage);
                break;
            case 'undo':
                canvasState.undoFromSocket(msg.prevImage);
                break;
            case 'redo':
                canvasState.redoFromSocket(msg.prevImage);
                break;
            case 'clearCanvas':
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvasState.canvas.width, canvasState.canvas.height);
                break;
            case 'chatMessage':
                chatMessagesState.addMessageFromSocket(msg);
                break;
            case 'closedConnection':
                generalState.addUser(msg);
                break;
            default:
                break;
        }
    };
};

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

export const sendWebSocket = (msg) => {
    if (msg.method === 'draw' && msg.figure.type === 'finish') {
        canvasState.canvas.getContext('2d').beginPath();
    }

    const msgWithIDs = {
        ...msg,
        userID: generalState.userID,
        sessionID: generalState.sessionID,
        username: generalState.username,
    };
    generalState.socket.send(JSON.stringify(msgWithIDs));
};
