// src/Modal.js

import React from 'react';
import './Modal.css'; // You should create a corresponding CSS file to style the modal

const Modal = ({ children, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <button onClick={onClose} className="modal-close-button">X</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
