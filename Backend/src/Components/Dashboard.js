import { useState, useEffect } from 'react';
import { VscError } from 'react-icons/vsc';
import { db } from '../firebase'; // Import your firebase configuration
import { ref, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [subjects, setSubjects] = useState([]);
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/Add_Subject')
    }

    useEffect(() => {
        // Reference to the 'subjects' node in the database
        const subjectsRef = ref(db, 'subjects');

        // Fetch data from the real-time database
        const fetchData = async () => {
            try {
                // Use onValue to listen for changes in the data
                onValue(subjectsRef, (snapshot) => {
                    const subjectsData = [];

                    // Check if data exists before processing
                    if (snapshot.exists()) {
                        snapshot.forEach((childSnapshot) => {
                            subjectsData.push(childSnapshot.val());
                        });

                        setSubjects(subjectsData);
                    } else {
                        console.log('No data available.');
                    }
                });
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };

        fetchData();
    }, []); // The empty dependency array ensures that this effect runs only once on component mount

    return (
        <div>
            <section>
                <div className="containe">
                    <div className="cards">
                        {subjects.map((subject, i) => (
                            <div key={i} className="card">
                                <h2>{subject.subjectID}</h2>
                                <h3>{subject.subjectName}</h3>
                                <h5>{subject.Year}</h5>
                                <span className="icon-container">
                                    <VscError />
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <div className="button-container">
                <button className="bottom-button" onClick={handleClick}>Add more Subjects</button>
            </div>
        </div>
    );
}
