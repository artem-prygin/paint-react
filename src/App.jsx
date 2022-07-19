import React from 'react';
import './styles/app.scss';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Content from './components/Content';

const App = () => {
    const sessionID = localStorage.getItem('sessionID');


    return (
        <BrowserRouter>
            <div className="app">
                <Routes>
                    <Route path="/:sessionID"
                           element={<Content/>}/>
                    <Route path="/"
                           element={<Navigate to={sessionID || Date.now().toString(16)}/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default App;
