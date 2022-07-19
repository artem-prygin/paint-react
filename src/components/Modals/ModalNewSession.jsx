import React, { useState } from 'react';
import canvasState from '../../store/canvasState';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LOCALHOST = 'http://localhost:3000';
const BASE_URL = process.env.NODE_ENV === 'production'
    ? location.origin
    : LOCALHOST;

const ModalNewSession = () => {
    const [modal, setModal] = useState(false);
    const navigate = useNavigate();

    const startNewSession = () => {
        setModal(false);
        localStorage.removeItem('sessionID');
        const ctx = canvasState.canvas.getContext('2d');
        ctx.clearRect(0, 0, canvasState.canvas.width, canvasState.canvas.height);
        canvasState.clearData();
        navigate(`/${Date.now().toString(16)}`);
    };

    return (
        <>
            <button className="btn btn-danger btn-sm ml-5 mr-5"
                    onClick={() => setModal(true)}>
                Start new session
            </button>

            <Modal show={modal}
                   onHide={() => setModal(false)}>
                <Modal.Header>
                    <Modal.Title>Are you sure you want to start new session?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <span>You can always return to current canvas using this link:</span>
                    <h6 className="bold">{`${BASE_URL}/${canvasState.sessionID}`}</h6>
                </Modal.Body>
                <Modal.Footer className="justify-between">
                    <Button variant="secondary"
                            onClick={() => setModal(false)}>
                        Cancel
                    </Button>

                    <Button variant="danger" onClick={() => startNewSession()}>
                        Start new session
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalNewSession;
