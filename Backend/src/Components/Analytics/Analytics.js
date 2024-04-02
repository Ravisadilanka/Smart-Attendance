import { useState, useEffect } from 'react';
import { VscError } from 'react-icons/vsc';
import { db, auth } from '../../firebase';
import { ref, onValue, remove, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import Sidemenu from '../SideMenu/Sidemenu';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import { onAuthStateChanged } from 'firebase/auth';

export default function Dashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [subjectToDelete, setSubjectToDelete] = useState(null); // New state
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/Add_Subject');
    };

    const handleCardClick = (event, subjectID) => {

        // Prevent the event from propagating to the parent container
        event.stopPropagation();

        // Redirect to the Add_Lecture route with the selected subjectID
        navigate(`/analytics/${subjectID}`);

    };

    const getSubjectKeys = async () => {
        const user = auth.currentUser;

        if (!user || !user.uid) {
            console.error('User not logged in.');
            return [];
        }

        const subjectsRef = ref(db, 'subjects');

        try {
            const snapshot = await get(subjectsRef);

            if (snapshot.exists()) {
                const keys = Object.keys(snapshot.val());
                console.log('Subject Keys:', keys);
                return keys;
            } else {
                console.log('No data available.');
                return [];
            }
        } catch (error) {
            console.error('Error getting subject keys:', error);
            return [];
        }
    };

    const handleDeleteSubject = async (subjectID) => {
        const user = auth.currentUser;

        if (!user || !user.uid) {
            console.error('User not logged in.');
            return;
        }

        try {
            // Get the subject keys
            const subjectKeys = await getSubjectKeys();

            // Reference to the 'subjects' node in the database
            const subjectsRef = ref(db, 'subjects');

            // Use onValue to listen for changes in the data
            onValue(subjectsRef, (snapshot) => {
                const subjectsData = [];

                // Check if data exists before processing
                if (snapshot.exists()) {
                    snapshot.forEach((childSnapshot) => {
                        const subject = childSnapshot.val();

                        // Check if the subject belongs to the logged-in user
                        if (user.uid === subject.userId) {
                            subjectsData.push(subject);

                            // Check if the current subject should be deleted
                            if (subject.subjectID === subjectID) {
                                // Remove the subject from the real-time database
                                remove(childSnapshot.ref);
                                console.log('Subject deleted successfully.');
                            }
                        }
                    });

                    // Remove the subject from the local state based on the subjectId
                    setSubjects((prevSubjects) =>
                        prevSubjects.filter((subject) => subject.subjectID !== subjectID)
                    );

                    // Update local storage to reflect the changes
                    localStorage.setItem('subjects', JSON.stringify(subjectsData));
                }
            });
        } catch (error) {
            console.error('Error deleting subject:', error);
        }
    };

    const handleConfirmDelete = (subjectID) => {
        setSubjectToDelete(subjectID);
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        if (subjectToDelete) {
            // Call your delete function here
            handleDeleteSubject(subjectToDelete);
            // Reset subjectToDelete state
            setSubjectToDelete(null);
        }
        setIsModalOpen(false); // Close the modal
    };

    const handleCloseModal = () => {
        setSubjectToDelete(null);
        setIsModalOpen(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const unsubscribe = onAuthStateChanged(auth, (user) => {
                    if (!user) {
                        console.log('User is not logged in.');
                        navigate('/l');
                    } else {
                        const subjectsRef = ref(db, 'subjects');

                        onValue(subjectsRef, (snapshot) => {
                            const subjectsData = [];

                            if (snapshot.exists()) {
                                snapshot.forEach((childSnapshot) => {
                                    const subject = childSnapshot.val();

                                    if (user.uid === subject.userId) {
                                        subjectsData.push(subject);
                                    }
                                });

                                setSubjects(subjectsData);
                                localStorage.setItem('subjects', JSON.stringify(subjectsData));
                            }
                        });
                    }
                });

                return () => unsubscribe();
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };

        fetchData();
    }, [navigate]); // The empty dependency array ensures that this effect runs only once on component mount

    return (
        <div>
            <div className='sidemenu'>
                <Sidemenu />
            </div>
            <section>
                <div className='containe'>
                    <div className='cards'>
                        {subjects.map((subject, i) => (
                            <div key={i} className='card'>
                                <div onClick={(e) => handleCardClick(e, subject.subjectID)}>
                                    <h2>{subject.subjectID}</h2>
                                    <h3>{subject.subjectName}</h3>
                                    <h5>{subject.Year}</h5>
                                    <h5>{subject.subjectRef}</h5>
                                </div>
                                <div className='icon-container'>
                                    <VscError onClick={() => handleConfirmDelete(subject.subjectID)} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <div className='button-container1'>
                <button className='bottom-button1' onClick={handleClick}>
                    Add more Subjects
                </button>
            </div>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={confirmDelete}
            />
        </div>
    );
}            