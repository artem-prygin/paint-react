import React, { useEffect, useRef } from 'react';
import '../styles/canvas.scss';
import { observer } from 'mobx-react-lite';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import Brush from '../tools/Brush';
import * as apiRequests from '../api/api.js';
import { openWebSocket } from '../api/websocket.js';

const Canvas = observer(() => {
    const canvasRef = useRef();

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current);

        if (toolState.tool) {
            return;
        }

        toolState.setTool(new Brush(canvasRef.current, canvasState.socket, canvasState.sessionID));
        apiRequests.getImage(canvasRef.current, canvasState.sessionID);
    }, [canvasState.socket]);

    useEffect(() => {
        if (!canvasState.username || canvasState.socket) {
            return;
        }

        openWebSocket(canvasRef.current, canvasState.sessionID)
    }, [canvasState.username, canvasState.socket]);

    return (
        <div className="canvas">
            <canvas ref={canvasRef}
                    width={1000}
                    height={600}/>
        </div>
    );
});

export default Canvas;
