import React, { useEffect, useState } from "react";
import { BsPencil, BsTrash } from "react-icons/bs";
import Sidemenu from "../SideMenu/Sidemenu";
import { get, ref, remove, set } from "firebase/database";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDatabase, child } from "firebase/database";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import './ViewStaff.css';

const ViewStaff = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({
        name: "",
        email: "",
        nicNumber: "",
        staffId: "",
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
                    if (user) {
                        const usersRef = ref(db, "users");
                        const snapshot = await get(usersRef);
                        const userDataFromFirebase = snapshot.val();

                        if (userDataFromFirebase) {
                            const usersWithUid = Object.keys(userDataFromFirebase).map(uid => ({
                                ...userDataFromFirebase[uid],
                                uid: uid
                            }));
                            setUsers(usersWithUid);
                            console.log('Users with UID:', usersWithUid);
                        }
                    } else {
                        console.error('No authenticated user');
                    }
                });

                return () => unsubscribeAuth();
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        };

        fetchUserData();
    }, []);

    const handleEdit = (user) => {
        setEditingUser(user);
        setEditForm({
            name: user.name,
            email: user.email,
            nicNumber: user.nicNumber || "",
            staffId: user.staffId || "",
        });
    };

    const handleDelete = async (uid) => {
        try {
            setUserToDelete(uid);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error preparing user for deletion:', error.message);
        }
    };

    const confirmDelete = async () => {
        try {
            // Add logic to delete the user from the database
            const rootRef = ref(getDatabase());
            const userRef = child(rootRef, `users/${userToDelete}`);
            await remove(userRef);

            // Update the state to reflect the deletion
            setUsers(prevUsers => prevUsers.filter(user => user.uid !== userToDelete));

            console.log(`User with UID ${userToDelete} deleted successfully`);
        } catch (error) {
            console.error('Error deleting user:', error.message);
        } finally {
            // Reset state and close the modal
            setUserToDelete(null);
            setIsModalOpen(false);
        }
    };

    const handleUpdate = async () => {
        try {
            // Update the user details in the database using uid
            const userRef = ref(db, `users/${editingUser.uid}`);
            await set(userRef, {
                name: editForm.name,
                email: editForm.email,
                nicNumber: editForm.nicNumber || null,
                staffId: editForm.staffId || null,
            });

            // Update the state to reflect the changes
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.uid === editingUser.uid ? { ...user, ...editForm } : user
                )
            );

            console.log(`User with UID ${editingUser.uid} updated successfully`);
        } catch (error) {
            console.error('Error updating user:', error.message);
        } finally {
            // Reset state and close the edit form/modal
            setEditingUser(null);
            setEditForm({
                name: "",
                email: "",
                nicNumber: "",
                staffId: "",
            });
        }
    };

    // Filter users who have staffId
    const usersWithStaffId = users.filter(user => user.staffId);

    return (
        <div className="table-wrapper">
            <Sidemenu />
            <div className='table-scroll'>
                <table className='table'>
                    <thead className='expand'>
                        <tr>
                            <th className="name-column">Name</th>
                            <th className="email-column">Email</th>
                            <th className="nic-column">NIC number</th>
                            <th className="staff-id-column">Staff ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                </table>
                <div className='table-body'>
                    <table className='table'>
                        <tbody>
                            {usersWithStaffId.map(user => (
                                <tr key={user.email}>
                                    <td className="name-column" style={{ width: '100px' }}>{user.name}</td>
                                    <td className="email-column">{user.email}</td>
                                    <td className="nic-column">{user.nicNumber}</td>
                                    <td className="staff-id-column">{user.staffId}</td>
                                    <td>
                                        <button className="edit-button" onClick={() => handleEdit(user)}>
                                            <BsPencil style={{ color: '#007bff' }} />
                                        </button>
                                        <button className="delete-button" onClick={() => handleDelete(user.uid)}>
                                            <BsTrash style={{ color: '#dc3545' }} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this user?"
            />
            {editingUser && (
                <div className={`edit-modal ${isModalOpen ? 'blur-effect' : ''}`}>
                    <h2>Edit User</h2>
                    <form>
                        <input
                            type="text"
                            placeholder="Name"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="NIC number"
                            value={editForm.nicNumber}
                            onChange={(e) => setEditForm({ ...editForm, nicNumber: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Staff ID"
                            value={editForm.staffId}
                            onChange={(e) => setEditForm({ ...editForm, staffId: e.target.value })}
                        />
                        <button type="button" onClick={handleUpdate}>
                            Update
                        </button>
                        <button type="button" onClick={() => setEditingUser(null)}>
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ViewStaff;
