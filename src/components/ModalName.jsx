import React, { useState } from 'react';
import '../styles/toolbar.scss';
import canvasState from '../store/canvasState';
import { Button, Modal } from 'react-bootstrap';
import { useEffect } from 'react';

const ModalName = () => {
    const [modalVisibility, setModalVisibility] = useState(true);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const usernameFromStorage = localStorage.getItem('username');
        if (usernameFromStorage) {
            setModalVisibility(false);
            setUsername(usernameFromStorage);
            canvasState.setUsername(usernameFromStorage);
        }
    }, []);

    const connectionHandler = () => {
        setModalVisibility(false);
        localStorage.setItem('username', username);
        canvasState.setUsername(username);
    };

    return (
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
                <Button variant="success"
                        disabled={username.length === 0}
                        onClick={() => connectionHandler()}>
                    Log in
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalName;
