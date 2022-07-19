import React from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import generalState from '../store/generalState.js';
import ModalName from './Modals/ModalName.jsx';
import Toolbar from './Toolbar.jsx';
import SettingBar from './SettingBar.jsx';
import Chat from './Chat.jsx';
import Canvas from './Canvas.jsx';

const Content = observer(() => {
    const { sessionID } = useParams();
    localStorage.setItem('sessionID', sessionID);
    generalState.setSessionID(sessionID);
    const { t } = useTranslation();

    return (
        window.innerWidth >= 1440

            ? <>
                <ModalName/>
                <Toolbar/>
                <SettingBar/>
                <div className="position-relative">
                    <Canvas/>
                    <Chat/>

                    {generalState.users.map((user, index) => {
                        setTimeout(() => generalState.removeUser(user.userID, user.isNew), 5000);

                        return (<div key={user.userID + index}
                                     style={{ top: 90 + 46 * index }}
                                     className={`position-absolute new-user-flash ${user.isNew ? 'new-user-flash__new' : ''}`}>
                            {user.username} {user.isNew ? t('HasJoined') : t('HasLeft')}
                        </div>);
                    })}
                </div>
            </>

            : <h3 className="p-5">{t('SorryThisServiceIsAvailableForSmallScreens')}</h3>
    );
});

export default Content;
