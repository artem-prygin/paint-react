import React, { useRef } from 'react';
import '../styles/chat.scss';
import chatMessagesState from '../store/chatMessagesState.js';
import { sendWebSocket } from '../api/websocket.js';
import { observer } from 'mobx-react-lite';

const Chat = observer(() => {
    const endOfChatBox = useRef();
    const messageInputRef = useRef();

    const sendMessage = () => {
        const chatMessage = messageInputRef.current.value;
        messageInputRef.current.value = '';
        messageInputRef.current.focus();

        chatMessagesState.addMessage(chatMessage);

        const msg = {
            method: 'chatMessage',
            chatMessage,
        };
        sendWebSocket(msg);

        setTimeout(() => {
            endOfChatBox.current?.scrollIntoView({ behavior: 'smooth' });
        });
    };

    const handleKeyDown = (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            sendMessage();
        }
    }

    return (
        <div className="chat position-absolute">
            <div className="chat-box">
                {chatMessagesState.chatMessages.map((msg, index) => {
                    return (
                        <div className="chat-message"
                             key={index}>
                            <span className="bold">{msg.username}:</span> {msg.chatMessage}
                        </div>
                    );
                })}
                <div ref={endOfChatBox}/>
            </div>

            <div className="type-message">
                <textarea ref={messageInputRef}
                          onKeyDown={handleKeyDown}/>
                <button className="btn btn-success btn-sm"
                        onClick={() => sendMessage()}>Send message
                </button>
            </div>
        </div>
    );
});

export default Chat;
