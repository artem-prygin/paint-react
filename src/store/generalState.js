import { makeAutoObservable } from 'mobx';

class GeneralState {
    users = [];
    username = '';
    socket = null;
    sessionID = null;
    userID = null;

    constructor() {
        makeAutoObservable(this);
    }

    clearData() {
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

    setUsername(username) {
        this.username = username;
    }
}

export default new GeneralState();
