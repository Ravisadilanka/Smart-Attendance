import React from 'react';
import Modal from 'react-modal';
import './ConfirmationModal.css'; // Import custom CSS for modal styling

// Style for the modal (you can customize this based on your design)
const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: 'none', // Remove border
        borderRadius: '8px', // Add border radius
        padding: '30px', // Add padding
        maxWidth: '400px', // Set maximum width
        width: '90%', // Set width to be responsive
        textAlign: 'center', // Center align content
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
            <h2 className="modal-title">Are you sure you want to delete this subject?</h2>
            <div className="modal-buttons">
                <button className="confirm-button" onClick={onConfirm}>Yes, delete</button>
                <button className="cancel-button" onClick={onClose}>Cancel</button>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;
