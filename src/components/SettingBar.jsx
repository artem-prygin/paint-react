import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/toolbar.scss';
import toolState from '../store/toolState';
import arrow from '../assets/arrow.svg';
import canvasState from '../store/canvasState.js';
import * as apiRequests from '../api/api.js';

const SettingBar = () => {
    const [lineWidth, setLineWidth] = useState(1);
    const navigate = useNavigate();

    const changeLineWidth = (num) => {
        if (lineWidth + num < 1 || lineWidth + num > 20) {
            return;
        }

        setLineWidth(lineWidth + num);
        toolState.setLineWidth(lineWidth);
    };

    const clearCanvasRef = () => {
        const ctx = canvasState.canvas.getContext('2d');
        ctx.clearRect(0, 0, canvasState.canvas.width, canvasState.canvas.height);
    };

    const clearCanvas = () => {
        canvasState.pushToUndo(canvasState.canvas.toDataURL());
        clearCanvasRef();
        apiRequests.saveImage(canvasState.canvas.toDataURL(), canvasState.sessionID);
    };

    const startNewSession = () => {
        localStorage.removeItem('sessionID');
        clearCanvasRef();
        canvasState.clearData();
        navigate(`/${Date.now().toString(16)}`);
    };

    return (
        <div className="toolbar setting-bar">
            <label className="ml-10">Line Width:</label>

            <div className="line-width ml-5">
                <img className="arrow"
                     onClick={() => changeLineWidth(1)}
                     src={arrow}
                     alt={arrow}/>
                <span>{lineWidth}</span>
                <img className="arrow arrow-reverse"
                     onClick={() => changeLineWidth(-1)}
                     src={arrow}
                     alt={arrow}/>
            </div>

            <label className="ml-10"
                   htmlFor="stroke-color">Line Color:</label>
            <input onChange={(e) => toolState.setStrokeColor(e.target.value)}
                   type="color"
                   className="ml-5 pointer"
                   id="stroke-color"/>

            <label className="ml-10"
                   htmlFor="fill-color">Fill Color:</label>
            <input onChange={(e) => toolState.setFillColor(e.target.value)}
                   className="ml-5 pointer"
                   type="color"
                   id="fill-color"/>

            <button className="btn btn-warning btn-sm ml-auto"
                    onClick={() => clearCanvas()}>
                Clear canvas
            </button>

            <button className="btn btn-danger btn-sm ml-5 mr-5"
                    onClick={() => startNewSession()}>
                Start new session
            </button>
        </div>
    );
};

export default SettingBar;
