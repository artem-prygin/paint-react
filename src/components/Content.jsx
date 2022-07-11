import React from 'react';
import Toolbar from './Toolbar';
import Canvas from './Canvas';
import SettingBar from './SettingBar';

const Content = () => {
    return (
        <>
            <Toolbar/>
            <SettingBar/>
            <Canvas/>
        </>
    );
};

export default Content;
