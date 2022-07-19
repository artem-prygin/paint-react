import { makeAutoObservable } from 'mobx';
import * as apiRequests from '../api/api.js';
import { sendWebSocket } from '../api/websocket.js';

class CanvasState {
    canvas = null;
    undoList = [];
    redoList = [];
    users = [];
    username = '';
    socket = null;
    sessionID = null;
    userID = null;

    constructor() {
        makeAutoObservable(this);
    }

    clearData() {
        this.undoList = [];
        this.redoList = [];
        this.sessionID = null;
        this.userID = null;
        this.socket.close();
        this.socket = null;
        this.users = [];
    }

    addUser(userMsg) {
        this.users.push({
            username: userMsg.username,
            userID: userMsg.userID,
            isNew: userMsg.isNew,
        });

        console.log(this.users);
    }

    removeUser(userID, isNew) {
        this.users = this.users
            .filter((user) => user.userID !== userID && user.isNew === isNew);
    }

    setSocket(socket) {
        this.socket = socket;
    }

    setSessionID(sessionID) {
        this.sessionID = sessionID;
    }

    setUserID(userID) {
        this.userID = userID;
    }

    setCanvas(canvas) {
        this.canvas = canvas;
    }

    setUsername(username) {
        this.username = username;
    }

    pushToUndo(prevImage) {
        this.undoList.push(prevImage);

        const pushToUndoMsg = {
            method: 'pushToUndo',
            prevImage,
        }
        sendWebSocket(pushToUndoMsg);
    }

    pushToUndoFromSocket(prevImage) {
        this.undoList.push(prevImage);
    }

    undo() {
        if (this.undoList.length > 0) {
            const prevImage = this.undoList.pop();
            const currentImage = this.canvas.toDataURL();
            this.redoList.push(currentImage);
            this.drawImage(prevImage);

            const undoMsg = {
                method: 'undo',
                prevImage,
            }
            sendWebSocket(undoMsg);
        }
    }

    undoFromSocket(prevImage) {
        const currentImage = this.canvas.toDataURL();
        this.redoList.push(currentImage);
        this.drawImage(prevImage);

        if (this.undoList.length > 0) {
            this.undoList.pop();
        }
    }

    redo() {
        if (this.redoList.length > 0) {
            const prevImage = this.redoList.pop();
            const currentImage = this.canvas.toDataURL();
            this.undoList.push(currentImage);
            this.drawImage(prevImage);

            const redoMsg = {
                method: 'redo',
                prevImage,
            }
            sendWebSocket(redoMsg);
        }
    }

    redoFromSocket(prevImage) {
        const currentImage = this.canvas.toDataURL();
        this.undoList.push(currentImage);
        this.drawImage(prevImage);

        if (this.redoList.length > 0) {
            this.redoList.pop();
        }
    }

    drawImage(dataUrl) {
        const ctx = this.canvas.getContext('2d');
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            apiRequests.saveImage(this.canvas.toDataURL(), this.sessionID);
        };
    }
}

export default new CanvasState();
