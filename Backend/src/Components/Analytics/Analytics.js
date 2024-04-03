import { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { ref, onValue, remove, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import Sidemenu from '../SideMenu/Sidemenu';

export default function Dashboard() {
    const [subjects, setSubjects] = useState([]);
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/Add_Subject');
    };

    const handleCardClick = (subjectID) => {
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = auth.currentUser;

                if (!user) {
                    console.log('User is not logged in.');
                    navigate('/login');
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
                            <div key={i} className='card' onClick={() => handleCardClick(subject.subjectID)}>
                                <h2>{subject.subjectID}</h2>
                                <h3>{subject.subjectName}</h3>
                                <h5>{subject.Year}</h5>
                                <h5>{subject.subjectRef}</h5>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
        </div>
    );
}
