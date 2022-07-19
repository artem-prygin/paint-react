import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toolState from '../store/toolState';
import canvasState from '../store/canvasState.js';
import generalState from '../store/generalState.js';
import * as apiRequests from '../api/api.js';
import { sendWebSocket } from '../api/websocket.js';
import ModalNewSession from './Modals/ModalNewSession.jsx';
import arrow from '../assets/arrow.svg';
import '../styles/toolbar.scss';

const SettingBar = () => {
    const [lineWidth, setLineWidth] = useState(1);
    const [newSessionModal, setNewSessionModal] = useState(false);
    const { t } = useTranslation();

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
        apiRequests.saveImage(canvasState.canvas.toDataURL(), generalState.sessionID);
    };

    return (
        <>
            {newSessionModal && <ModalNewSession newSessionModal={newSessionModal}
                                                 setNewSessionModal={setNewSessionModal}/>}
            <div className="toolbar setting-bar">
                <label className="ml-10">{t('LineWidth')}:</label>

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
                       htmlFor="stroke-color">{t('LineColor')}:</label>
                <input onChange={(e) => toolState.setStrokeColor(e.target.value)}
                       type="color"
                       className="ml-5 pointer"
                       id="stroke-color"/>

                <label className="ml-10"
                       htmlFor="fill-color">{t('FillColor')}:</label>
                <input onChange={(e) => toolState.setFillColor(e.target.value)}
                       className="ml-5 pointer"
                       type="color"
                       id="fill-color"/>

                <button className="btn btn-warning btn-sm ml-auto"
                        onClick={() => clearCanvas()}>
                    {t('ClearCanvas')}
                </button>

                <ModalNewSession/>
            </div>
        </>
    );
};

export default SettingBar;
