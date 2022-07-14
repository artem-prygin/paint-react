import React, { useEffect, useRef, useState } from 'react';
import '../styles/canvas.scss';
import { observer } from 'mobx-react-lite';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import Brush from '../tools/Brush';
import { Button, Modal } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Rect from '../tools/Rect.js';
import axios from 'axios';
import Circle from '../tools/Circle.js';

const WS_LOCALHOST = 'ws://localhost:5000/';

const Canvas = observer(() => {
    const canvasRef = useRef();
    const [username, setUsername] = useState('');
    const [modalVisibility, setModalVisibility] = useState(true);
    const [socket, setSocket] = useState(null);
    const { sessionID } = useParams();

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current);
        toolState.setTool(new Brush(canvasRef.current));
        axios.get(`http://localhost:5000/image?sessionID=${sessionID}`)
            .then((res) => {
                const img = new Image();
                img.src = res.data;
                img.onload = () => {
                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                };
            })
            .catch(console.error);

        const usernameFromStorage = sessionStorage.getItem('username');
        if (usernameFromStorage) {
            setModalVisibility(false);
            setUsername(usernameFromStorage);
            canvasState.setUsername(usernameFromStorage);
        }
    }, []);

    useEffect(() => {
        if (!canvasState.username || socket) return;

        const WS_HOST = process.env.NODE_ENV === 'production'
            ? location.origin.replace(/^http/, 'ws')
            : WS_LOCALHOST;

        const ws = new WebSocket(WS_HOST);
        setSocket(ws);
        canvasState.setSessionID(sessionID);
        canvasState.setSocket(ws);
        toolState.setTool(new Brush(canvasRef.current, ws, sessionID));

        ws.onopen = () => {
            const data = {
                sessionID,
                username: canvasState.username,
                method: 'connection',
            };

            const pingPong = setInterval(() => {
                if (ws.readyState !== 1) {
                    clearInterval(pingPong);
                    return;
                }

                ws.send('1');
            }, 10000);

            ws.send(JSON.stringify(data));
        };

        ws.onmessage = (e) => {
            const msg = JSON.parse(e.data);

            switch (msg.method) {
                case 'connection':
                    console.log(`User ${msg.username} has logged in`);
                    break;
                case 'draw':
                    drawHandler(msg);
                    break;
                default:
                    break;
            }
        };
    }, [canvasState.username]);

    const mouseUpHandler = () => {
        const image = canvasRef.current.toDataURL();
        canvasState.pushToUndo(image);
        axios.post(`http://localhost:5000/image?sessionID=${sessionID}`, { image })
            .then(() => console.log('success'))
            .catch(console.error);
    };

    const connectionHandler = () => {
        setModalVisibility(false);
        sessionStorage.setItem('username', username);
        canvasState.setUsername(username);
    };

    const drawHandler = (msg) => {
        const figure = msg.figure;
        const ctx = canvasRef.current.getContext('2d');

        switch (figure.type) {
            case 'brush':
                Brush.draw(ctx, figure);
                break;
            case 'rect':
                Rect.staticDraw(ctx, figure);
                ctx.beginPath();
                break;
            case 'circle':
                Circle.staticDraw(ctx, figure);
                ctx.beginPath();
                break;
            case 'finish':
                ctx.beginPath();
                break;
        }
    };

    return (
        <div className="canvas">
            <Modal show={modalVisibility}>
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

            <canvas onMouseUp={() => mouseUpHandler()}
                    ref={canvasRef}
                    width={1000}
                    height={600}/>
        </div>
    );
});

export default Canvas;
