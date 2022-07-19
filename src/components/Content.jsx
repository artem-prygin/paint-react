import React from 'react';
import Toolbar from './Toolbar';
import Canvas from './Canvas';
import SettingBar from './SettingBar';
import ModalName from './Modals/ModalName.jsx';
import { useParams } from 'react-router-dom';
import canvasState from '../store/canvasState.js';
import Chat from './Chat.jsx';
import { observer } from 'mobx-react-lite';

const Content = observer(() => {
    const { sessionID } = useParams();
    localStorage.setItem('sessionID', sessionID);
    canvasState.setSessionID(sessionID);

    return (
        window.innerWidth >= 1440

            ? <>
                <ModalName/>
                <Toolbar/>
                <SettingBar/>
                <div className="position-relative">
                    <Canvas/>
                    <Chat/>

                    {canvasState.users.map((user, index) => {
                        setTimeout(() => canvasState.removeUser(user.userID, user.isNew), 5000);

                        return (<div key={user.userID + index}
                                     style={{ top: 90 + 46 * index }}
                                     className={`position-absolute new-user-flash ${user.isNew ? 'new-user-flash__new' : ''}`}>
                            {user.username} {user.isNew ? 'has joined' : 'has left'}
                        </div>);
                    })}
                </div>
            </>

            : <h3 className="p-5">Sorry, this service is available only for 1440px screens and more</h3>
    );
});

export default Content;
