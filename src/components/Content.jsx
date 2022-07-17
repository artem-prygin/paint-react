import React from 'react';
import Toolbar from './Toolbar';
import Canvas from './Canvas';
import SettingBar from './SettingBar';
import ModalName from './ModalName.jsx';
import { useParams } from 'react-router-dom';
import canvasState from '../store/canvasState.js';

const Content = () => {
    const { sessionID } = useParams();
    localStorage.setItem('sessionID', sessionID);
    canvasState.setSessionID(sessionID);

    return (
        <>
            <ModalName/>
            <Toolbar/>
            <SettingBar/>
            <Canvas/>
        </>
    );
};

export default Content;
