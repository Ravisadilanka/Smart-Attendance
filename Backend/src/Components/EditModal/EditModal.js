import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { ref, update } from 'firebase/database';
import { getDatabase, child } from 'firebase/database';

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

const EditModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [editedUser, setEditedUser] = useState({ ...user });

  useEffect(() => {
    // Update the editedUser state when the user prop changes
    setEditedUser({ ...user });
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const database = getDatabase();
      const userRef = ref(database, `users/${editedUser.uid}`);
      
      // Update the user data in the database
      await update(userRef, editedUser);

      // Notify the parent component that the user has been updated
      onUpdate(editedUser);

      // Close the modal
      onClose();
    } catch (error) {
      console.error('Error updating user:', error.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Edit Modal"
    >
      <h2>Edit User Details</h2>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={editedUser.name || ''}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={editedUser.email || ''}
          onChange={handleInputChange}
        />
      </label>
      {/* Add other fields as needed */}
      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </Modal>
  );
};

export default EditModal;
