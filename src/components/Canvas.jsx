import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import canvasState from '../store/canvasState';
import generalState from '../store/generalState';
import toolState from '../store/toolState';
import * as apiRequests from '../api/api.js';
import { openWebSocket } from '../api/websocket.js';
import Brush from '../tools/Brush.js';
import '../styles/canvas.scss';

const Canvas = observer(() => {
    const canvasRef = useRef();

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current);

        if (toolState.tool) {
            return;
        }

        toolState.setTool(new Brush());
        apiRequests.getImage(canvasRef.current, generalState.sessionID);
    }, [generalState.socket]);

    useEffect(() => {
        if (!generalState.username || generalState.socket) {
            return;
        }

        openWebSocket(canvasRef.current, generalState.sessionID)
    }, [generalState.username, generalState.socket]);

    return (
        <div className="canvas">
            <canvas ref={canvasRef}
                    width={1000}
                    height={600}/>
        </div>
    );
});

export default Canvas;
