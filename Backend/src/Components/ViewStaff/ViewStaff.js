import React, { useEffect, useState } from "react";
import { BsPencil, BsTrash } from "react-icons/bs";
import Sidemenu from "../SideMenu/Sidemenu";
import { get, ref, remove, set, push } from "firebase/database";
import { createUserWithEmailAndPassword, deleteUser, getAuth, updateProfile } from "firebase/auth";
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
    const [isAddLecturerModalOpen, setIsAddLecturerModalOpen] = useState(false);
    const [newLecturer, setNewLecturer] = useState({
        name: "",
        email: "",
        nicNumber: "",
        staffId: "",
    });
    const [isAddLecturerFieldsVisible, setIsAddLecturerFieldsVisible] = useState(false);
    const [lecturerError, setLecturerError] = useState('')


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

        setTimeout(() => {
            setLecturerError('');
        }, 3000);

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
            // 1. Delete user data from the database
            const rootRef = ref(getDatabase());
            const userRef = child(rootRef, `users/${userToDelete}`);
            await remove(userRef);
    
            // 2. Delete user account from Firebase Authentication
            const authInstance = getAuth(); // Use getAuth to get the auth instance
            const user = authInstance.currentUser;
    
            if (user) {
                console.log("Deleting user account:", user.uid);
                await deleteUser(user);
            } else {
                console.error("No authenticated user found");
            }
    
            // 3. Update the state to remove the deleted user
            setUsers(prevUsers => prevUsers.filter(user => user.uid !== userToDelete));
        } catch (error) {
            console.error('Error deleting user:', error.message);
            setLecturerError(error.message)
        } finally {
            setUserToDelete(null);
            setIsModalOpen(false);
        }
    };

    const handleUpdate = async () => {
        try {
            const userRef = ref(db, `users/${editingUser.uid}`);
            await set(userRef, {
                name: editForm.name,
                email: editForm.email,
                nicNumber: editForm.nicNumber || null,
                staffId: editForm.staffId || null,
            });

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.uid === editingUser.uid ? { ...user, ...editForm } : user
                )
            );
        } catch (error) {
            console.error('Error updating user:', error.message);
            setLecturerError(error.message)
        } finally {
            setEditingUser(null);
            setEditForm({
                name: "",
                email: "",
                nicNumber: "",
                staffId: "",
            });
        }
    };

    const openAddLecturerModal = () => {
        setIsAddLecturerModalOpen(true);
        setNewLecturer({
            name: "",
            email: "",
            nicNumber: "",
            staffId: "",
        });
        setIsAddLecturerFieldsVisible(true);
    };

    const handleAddLecturer = async () => {
        try {
            const { user } = await createUserWithEmailAndPassword(auth, newLecturer.email, "123456");

            await updateProfile(user, {
                displayName: newLecturer.name,
            });

            const usersRef = ref(db, `users/${user.uid}`);
            await set(usersRef, {
                name: newLecturer.name,
                email: newLecturer.email,
                nicNumber: newLecturer.nicNumber || null,
                staffId: newLecturer.staffId || null,
            });

            setUsers(prevUsers => [
                ...prevUsers,
                {
                    ...newLecturer,
                    uid: user.uid,
                },
            ]);
        } catch (error) {
            console.error('Error adding lecturer:', error.message);
            setLecturerError(error.message)
        } finally {
            setIsAddLecturerFieldsVisible(false);
            setIsAddLecturerModalOpen(false);
        }
    };

    const usersWithStaffId = users.filter(user => user.staffId);

    return (
        <div className="table-wrapper">
            <Sidemenu />
            <div className='table-scroll'>
                <p>{lecturerError}</p>
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
                                    <td className="name-column">{user.name}</td>
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
            <button type="button" className='bottom-button1' onClick={openAddLecturerModal}>
                Add Lecturer
            </button>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this user?"
            />
            {editingUser && (
                <div className={`edit-modal`}>
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
            {isAddLecturerFieldsVisible && (
                <div className={`add-lecturer-modal`}>
                    <h2>Add Lecturer</h2>
                    <form>
                        <input
                            type="text"
                            placeholder="Name"
                            value={newLecturer.name}
                            onChange={(e) => setNewLecturer({ ...newLecturer, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Email"
                            value={newLecturer.email}
                            onChange={(e) => setNewLecturer({ ...newLecturer, email: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="NIC number"
                            value={newLecturer.nicNumber}
                            onChange={(e) => setNewLecturer({ ...newLecturer, nicNumber: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Staff ID"
                            value={newLecturer.staffId}
                            onChange={(e) => setNewLecturer({ ...newLecturer, staffId: e.target.value })}
                        />
                        <button type="button" onClick={handleAddLecturer}>
                            Add Lecturer
                        </button>
                        <button type="button" onClick={() => {
                            setIsAddLecturerModalOpen(false);
                            setIsAddLecturerFieldsVisible(false); // Add this line to hide the fields
                        }}>
                            Cancel
                        </button>

                    </form>
                </div>
            )}
        </div>
    );
};

export default ViewStaff;
