import { makeAutoObservable } from 'mobx';
import canvasState from './canvasState.js';

class ChatMessagesState {
    chatMessages = [];

    constructor() {
        makeAutoObservable(this);
    }

    addMessage(chatMessage) {
        this.chatMessages.push({
            chatMessage,
            username: canvasState.username,
        });
    }

    addMessageFromSocket(chatMessageObj) {
        this.chatMessages.push({
            chatMessage: chatMessageObj.chatMessage,
            username: chatMessageObj.username,
        });
    }
}

export default new ChatMessagesState();
