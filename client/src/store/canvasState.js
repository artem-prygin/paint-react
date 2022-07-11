import { makeAutoObservable } from 'mobx';

class CanvasState {
    canvas = null;
    undoList = [];
    redoList = [];
    username = '';
    socket = null;
    sessionID = null;

    constructor() {
        makeAutoObservable(this)
    }

    setSocket(socket) {
        this.socket = socket;
    }

    setSessionID(sessionID) {
        this.sessionID = sessionID;
    }

    setCanvas(canvas) {
        this.canvas = canvas;
    }

    setUsername(username) {
        this.username = username;
    }

    pushToUndo(data) {
        this.undoList.push(data);
    }

    undo() {
        if (this.undoList.length) {
            const dataUrl = this.undoList.pop();
            this.redoList.push(this.canvas.toDataURL());
            this.drawImage(dataUrl);
            return;
        }

        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    redo() {
        if (this.redoList.length) {
            const dataUrl = this.redoList.pop();
            this.pushToUndo(this.canvas.toDataURL());
            this.drawImage(dataUrl);
        }
    }

    drawImage(dataUrl) {
        const ctx = this.canvas.getContext('2d');
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

export default new CanvasState();
