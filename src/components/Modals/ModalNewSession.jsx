import React, { useState } from 'react';
import canvasState from '../../store/canvasState';
import generalState from '../../store/generalState';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LOCALHOST = 'http://localhost:3000';
const BASE_URL = process.env.NODE_ENV === 'production'
    ? location.origin
    : LOCALHOST;

const ModalNewSession = () => {
    const [modal, setModal] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const startNewSession = () => {
        setModal(false);
        localStorage.removeItem('sessionID');
        const ctx = canvasState.canvas.getContext('2d');
        ctx.clearRect(0, 0, canvasState.canvas.width, canvasState.canvas.height);
        canvasState.clearData();
        generalState.clearData();
        navigate(`/${Date.now().toString(16)}`);
    };

    return (
        <>
            <button className="btn btn-danger btn-sm ml-5 mr-5"
                    onClick={() => setModal(true)}>
                {t('StartNewSession')}
            </button>

            <Modal show={modal}
                   onHide={() => setModal(false)}>
                <Modal.Header>
                    <Modal.Title> {t('AreYouSureYouWantToStartNewSession')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <span>{t('YouСanAlwaysReturnToCurrentSessionViaThisLink')}:</span>
                    <span className="bold">{` ${BASE_URL}/${generalState.sessionID}`}</span>
                </Modal.Body>
                <Modal.Footer className="justify-between">
                    <Button variant="secondary"
                            onClick={() => setModal(false)}>
                        {t('Cancel')}
                    </Button>

                    <Button variant="danger" onClick={() => startNewSession()}>
                        {t('StartNewSession')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalNewSession;
