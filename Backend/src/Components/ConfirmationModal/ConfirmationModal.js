import React from 'react';
import Modal from 'react-modal';

// Style for the modal (you can customize this based on your design)
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

Modal.setAppElement('#root'); // Set the root element for the modal

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={customStyles}
            contentLabel="Confirmation Modal"
        >
            <h2>Are you sure you want to delete this subject?</h2>
            <button onClick={onConfirm}>Yes, delete</button>
            <button onClick={onClose}>Cancel</button>
        </Modal>
    );
};

export default ConfirmationModal;
