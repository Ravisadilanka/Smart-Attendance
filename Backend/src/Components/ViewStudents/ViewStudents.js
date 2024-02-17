import React, { useEffect, useState } from "react";
import { BsPencil, BsTrash } from "react-icons/bs";
import Sidemenu from "../SideMenu/Sidemenu";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import { get, ref, remove, set } from "firebase/database";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getDatabase, child } from "firebase/database";
import { useParams } from "react-router-dom";
import './ViewStudents.css'

const ViewStudents = () => {
    const [users, setUsers] = useState([]);
    const { academicYear } = useParams()
    const [students, setStudents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [editingStudent, setEditingStudent] = useState(null);
    const [editForm, setEditForm] = useState({
        name: "",
        academicYear: "",
        department: "",
        studentId: "",
    });

    const decodedAcademicYear = decodeURIComponent(academicYear);
    const [isAddLecturerModalOpen, setIsAddLecturerModalOpen] = useState(false);
    const [newStudent, setNewStudent] = useState({
        name: "",
        email:"",
        academicYear: "",
        department: "",
        studentId: "",
    });
    const [isAddLecturerFieldsVisible, setIsAddLecturerFieldsVisible] = useState(false);
    const [lecturerError, setLecturerError] = useState('')

    useEffect(() => {
        const fetchStudentsData = async () => {
            try {
                const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
                    if (user) {
                        const studentsRef = ref(db, "Students");
                        const snapshot = await get(studentsRef);
                        const studentsDataFromFirebase = snapshot.val();

                        if (studentsDataFromFirebase) {
                            const studentsArray = Object.entries(studentsDataFromFirebase).map(
                                ([id, details]) => ({
                                    id,
                                    ...details,
                                })
                            );
                            setStudents(studentsArray);
                        }
                    } else {
                        console.error("No authenticated user");
                    }
                });

                return () => unsubscribeAuth();
            } catch (error) {
                console.error("Error fetching student data:", error.message);
            }
        };

        fetchStudentsData();
    }, []);

    const handleEdit = (student) => {
        setEditingStudent(student);
        setEditForm({
            name: student.name,
            academicYear: student.AcademicYear,
            department: student.Department || "",
            studentId: student.id || "",
        });
    };

    const handleDelete = async (studentId) => {
        try {
            setStudentToDelete(studentId);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error preparing student for deletion:", error.message);
        }
    };

    const confirmDelete = async () => {
        try {
            // Add logic to delete the student from the database
            const rootRef = ref(getDatabase());
            const studentRef = child(rootRef, `Students/${studentToDelete}`);
            await remove(studentRef);

            // Update the state to reflect the deletion
            setStudents((prevStudents) =>
                prevStudents.filter((student) => student.id !== studentToDelete)
            );

            console.log(`Student with ID ${studentToDelete} deleted successfully`);
        } catch (error) {
            console.error("Error deleting student:", error.message);
        } finally {
            // Reset state and close the modal
            setStudentToDelete(null);
            setIsModalOpen(false);
        }
    };

    const handleUpdate = async () => {
        try {
            // Update the student details in the database using id
            const studentRef = ref(db, `Students/${editingStudent.id}`);
            await set(studentRef, {
                name: editForm.name,
                AcademicYear: editForm.academicYear,
                Department: editForm.department || null,
                id: editForm.studentId || null,
            });

            // Update the state to reflect the changes
            setStudents((prevStudents) =>
                prevStudents.map((student) =>
                    student.id === editingStudent.id ? { ...student, ...editForm } : student
                )
            );

            console.log(`Student with ID ${editingStudent.id} updated successfully`);
        } catch (error) {
            console.error("Error updating student:", error.message);
        } finally {
            // Reset state and close the edit form/modal
            setEditingStudent(null);
            setEditForm({
                name: "",
                academicYear: "",
                department: "",
                studentId: "",
            });
        }
    };

    const openAddLecturerModal = () => {
        setIsAddLecturerModalOpen(true);
        setNewStudent({
            name: "",
            email: "",
            nicNumber: "",
            staffId: "",
        });
        setIsAddLecturerFieldsVisible(true);
    };

    const handleAddLecturer = async () => {
        try {
            const { user } = await createUserWithEmailAndPassword(auth, newStudent.email, "123456");

            await updateProfile(user, {
                displayName: newStudent.name,
            });

            const usersRef = ref(db, `Students/${newStudent.studentId}`);
            await set(usersRef, {
                name: newStudent.name,
                email: newStudent.email,
                AcademicYear: newStudent.academicYear,
                Department: newStudent.department,
                id: newStudent.studentId
            });

            setUsers(prevUsers => [
                ...prevUsers,
                {
                    ...newStudent,
                    id: newStudent.id,
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

    return (
        <div className="table-wrapper">
            <Sidemenu />
            <div className="table-scroll">
                <table className="table">
                    <thead className="expand">
                        <tr>
                            <th className="name-column">Name</th>
                            <th className="academicYear-column">Academic Year</th>
                            <th className="department-column">Department</th>
                            <th className="studentId-column">Student ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                </table>
                <div className="table-body">
                    <table className="table">
                        <tbody>
                            {students.map((student) => (
                                student.AcademicYear === decodedAcademicYear && (<tr key={student.id}>
                                    <td className="name-column">{student.name}</td>
                                    <td className="academicYear-column">{student.AcademicYear}</td>
                                    <td className="department-column">{student.Department}</td>
                                    <td className="studentId-column">{student.id}</td>
                                    <td>
                                        <button
                                            className="edit-button"
                                            onClick={() => handleEdit(student)}
                                        >
                                            <BsPencil style={{ color: "#007bff" }} />
                                        </button>
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDelete(student.id)}
                                        >
                                            <BsTrash style={{ color: "#dc3545" }} />
                                        </button>
                                    </td>
                                </tr>)
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <button type="button" className='bottom-button1' onClick={openAddLecturerModal}>
                Add Student
            </button>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this student?"
            />
            {editingStudent && (
                <div className={`edit-modal ${isModalOpen ? "blur-effect" : ""}`}>
                    <h2>Edit Student</h2>
                    <form>
                        <input
                            type="text"
                            placeholder="Name"
                            value={editForm.name}
                            onChange={(e) =>
                                setEditForm({ ...editForm, name: e.target.value })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Academic Year"
                            value={editForm.academicYear}
                            onChange={(e) =>
                                setEditForm({ ...editForm, academicYear: e.target.value })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Department"
                            value={editForm.department}
                            onChange={(e) =>
                                setEditForm({ ...editForm, department: e.target.value })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Student ID"
                            value={editForm.studentId}
                            onChange={(e) =>
                                setEditForm({ ...editForm, studentId: e.target.value })
                            }
                        />
                        <button type="button" onClick={handleUpdate}>
                            Update
                        </button>
                        <button type="button" onClick={() => setEditingStudent(null)}>
                            Cancel
                        </button>
                    </form>
                </div>
            )}
            {isAddLecturerFieldsVisible && (
                <div className={`add-lecturer-modal`}>
                    <h2>Add Student</h2>
                    <form>
                        <input
                            type="text"
                            placeholder="Name"
                            value={newStudent.name}
                            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Email"
                            value={newStudent.email}
                            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Department"
                            value={newStudent.department}
                            onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Academic Year"
                            value={newStudent.academicYear}
                            onChange={(e) => setNewStudent({ ...newStudent, academicYear: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Student ID"
                            value={newStudent.studentId}
                            onChange={(e) => setNewStudent({ ...newStudent, studentId: e.target.value })}
                        />
                        <button type="button" onClick={handleAddLecturer}>
                            Add Student
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

export default ViewStudents;
