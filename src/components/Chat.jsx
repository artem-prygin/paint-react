import React, { useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { sendWebSocket } from '../api/websocket.js';
import generalState from '../store/generalState.js';
import chatMessagesState from '../store/chatMessagesState.js';
import '../styles/chat.scss';

const Chat = observer(() => {
    const [sendMsgDisabled, setSendMsgDisabled] = useState(true);
    const endOfChatBox = useRef();
    const messageInputRef = useRef();
    const { t } = useTranslation();

    const sendMessage = () => {
        const chatMessage = messageInputRef.current.value;

        if (chatMessage.length === 0) return;

        messageInputRef.current.value = '';
        messageInputRef.current.focus();

        chatMessagesState.addMessage(chatMessage);

        const msg = {
            method: 'chatMessage',
            chatMessage,
        };
        sendWebSocket(msg);
    };

    const handleKeyDown = (e) => {
        if (e.ctrlKey && e.key === 'Enter' && messageInputRef.current?.value.length > 0) {
            sendMessage();
        }
    };

    return (
        <div className="chat position-absolute">
            <div className="chat-box">
                {chatMessagesState.chatMessages.length === 0 &&
                    <span className="opacity-50 pointer-events-none">{t('ChatIsEmptyWriteYourFirstMessage')}</span>}
                {chatMessagesState.chatMessages.map((msg, index, arr) => {
                    if (index === arr.length - 1) {
                        setTimeout(() => {
                            endOfChatBox.current?.scrollIntoView({ behavior: 'smooth' });
                        });
                    }

                    return (
                        <div className="chat-message"
                             key={index}>
                            <span className={`bold ${msg.userID === generalState.userID ? 'chat-message__own' : ''}`}>
                                {msg.username}:
                            </span> {msg.chatMessage}
                        </div>
                    );
                })}
                <div ref={endOfChatBox}/>
            </div>

            <div className="type-message">
                <textarea ref={messageInputRef}
                          onChange={((e) => setSendMsgDisabled(!e.target.value.length))}
                          onKeyDown={handleKeyDown}/>
                <button className="btn btn-success btn-sm"
                        disabled={sendMsgDisabled}
                        onClick={() => sendMessage()}>
                    {t('SendMessage')}
                </button>
            </div>
        </div>
    );
});

export default Chat;
