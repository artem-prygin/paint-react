import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/toolbar.scss';
import toolState from '../store/toolState';
import arrow from '../assets/arrow.svg';
import canvasState from '../store/canvasState.js';
import * as apiRequests from '../api/api.js';
import { sendWebSocket } from '../api/websocket.js';
import ModalNewSession from './Modals/ModalNewSession.jsx';

const SettingBar = () => {
    const [lineWidth, setLineWidth] = useState(1);
    const [newSessionModal, setNewSessionModal] = useState(false);

    const changeLineWidth = (num) => {
        if (lineWidth + num < 1 || lineWidth + num > 20) {
            return;
        }

        setLineWidth(lineWidth + num);
        toolState.setLineWidth(lineWidth);
    };

    const clearCanvas = () => {
        canvasState.pushToUndo(canvasState.canvas.toDataURL());
        const ctx = canvasState.canvas.getContext('2d');
        ctx.clearRect(0, 0, canvasState.canvas.width, canvasState.canvas.height);
        const msg = {
            method: 'clearCanvas',
        };
        sendWebSocket(msg);
        apiRequests.saveImage(canvasState.canvas.toDataURL(), canvasState.sessionID);
    };

    return (
        <>
            {newSessionModal && <ModalNewSession newSessionModal={newSessionModal} setNewSessionModal={setNewSessionModal}/>}
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

                <ModalNewSession/>
            </div>
        </>
    );
};

export default SettingBar;
