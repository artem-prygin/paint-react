import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import generalState from '../../store/generalState';

const ModalName = () => {
    const [modalVisibility, setModalVisibility] = useState(true);
    const [username, setUsername] = useState('');
    const { t } = useTranslation();

    useEffect(() => {
        const usernameFromStorage = localStorage.getItem('username');
        if (usernameFromStorage) {
            setModalVisibility(false);
            setUsername(usernameFromStorage);
            generalState.setUsername(usernameFromStorage);
        }
    }, []);

    const connectionHandler = () => {
        setModalVisibility(false);
        localStorage.setItem('username', username);
        generalState.setUsername(username);
    };

    return (
        <Modal show={modalVisibility}>
            <Modal.Header>
                <Modal.Title>{t('TypeYourName')}</Modal.Title>
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
                    {t('LogIn')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalName;
