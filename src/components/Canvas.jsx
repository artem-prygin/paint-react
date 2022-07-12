import React, { useEffect, useRef, useState } from 'react';
import '../styles/canvas.scss';
import { observer } from 'mobx-react-lite';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import Brush from '../tools/Brush';
import { Button, Modal } from 'react-bootstrap';
import { useParams } from 'react-router-dom';


const Canvas = observer(() => {
    const canvasRef = useRef();
    const [modalVisibility, setModalVisibility] = useState(true);
    const [username, setUsername] = useState('');
    const { sessionID } = useParams();

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current);
        toolState.setTool(new Brush(canvasRef.current));
    }, []);

    useEffect(() => {
        if (!canvasState.username) return;

        const socket = new WebSocket('ws://paint-react-artempr.herokuapp.com/');
        canvasState.setSocket(socket);
        canvasState.setSessionID(sessionID);
        toolState.setTool(new Brush(canvasRef.current, socket, sessionID));

        socket.onopen = () => {
            const data = {
                sessionID,
                username: canvasState.username,
                method: 'connection',
            };

            socket.send(JSON.stringify(data));
        };

        socket.onmessage = (e) => {
            const msg = JSON.parse(e.data);

            switch (msg.method) {
                case 'connection':
                    console.log(`User ${msg.username} has logged in`);
                    break;
                case 'draw':
                    drawHandler(msg);
                    break;
            }
        };
    }, [canvasState.username]);

    const mouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL());
    };

    const connectionHandler = () => {
        canvasState.setUsername(username);
        setModalVisibility(false);
    };

    const drawHandler = (msg) => {
        const figure = msg.figure;
        const ctx = canvasRef.current.getContext('2d');

        switch (figure.type) {
            case 'brush':
                Brush.draw(ctx, figure);
                break;
            case 'finish':
                ctx.beginPath();
                break;
        }
    };

    return (
        <div className="canvas">
            <Modal show={modalVisibility}
                   onHide={() => {
                   }}>
                <Modal.Header>
                    <Modal.Title>Type your name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input onChange={(e) => setUsername(e.target.value)}
                           required
                           type="text"/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary"
                            disabled={username.length === 0}
                            onClick={() => connectionHandler()}>
                        Log in
                    </Button>
                </Modal.Footer>
            </Modal>

            <canvas onMouseDown={() => mouseDownHandler()}
                    ref={canvasRef}
                    width={1000}
                    height={600}/>
        </div>
    );
});

export default Canvas;
