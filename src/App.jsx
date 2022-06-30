import React from 'react';
import './styles/app.scss';
import Toolbar from './components/Toolbar';
import SettingBar from './components/SettingBar';
import Canvas from './components/Canvas';

const App = () => {
    return (
        <div className="app">
            <Toolbar/>
            <SettingBar/>
            <Canvas/>
        </div>
    )
}


export default App;
