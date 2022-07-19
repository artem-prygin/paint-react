import { makeAutoObservable } from 'mobx';
import generalState from './generalState.js';

class ChatMessagesState {
    chatMessages = [];

    constructor() {
        makeAutoObservable(this);
    }

    addMessage(chatMessage) {
        this.chatMessages.push({
            chatMessage,
            username: generalState.username,
            userID: generalState.userID,
        });
    }

    addMessageFromSocket(chatMessageObj) {
        this.chatMessages.push({
            chatMessage: chatMessageObj.chatMessage,
            username: chatMessageObj.username,
            userID: chatMessageObj.userID,
        });
    }
}

export default new ChatMessagesState();
