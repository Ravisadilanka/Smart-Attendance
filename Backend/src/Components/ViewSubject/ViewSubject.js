import { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { ref, onValue} from 'firebase/database';
import { useNavigate, useParams } from 'react-router-dom';
import Sidemenu from '../SideMenu/Sidemenu';
import { onAuthStateChanged } from 'firebase/auth';

const ViewSubject = () => {

    const { subjectID } = useParams();
  const [lectures, setLectures] = useState([]);
  const navigate = useNavigate();


    const handleCardClick = (lectureNumber) => {
        navigate(`/StudentAttendance/${subjectID}/lecture/${lectureNumber}`);
      };

    useEffect(() => {

        const fetchData = async () => {
            try {
                const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
                    if (!user) {
                        console.log('No user is logged in.');
                        // Handle accordingly, redirect to login or show a message
                        // You may want to set lecturesData to an empty array here
                        return;
                    }
    
                    // Reference to the 'lectures' node in the database
                    const lecturesRef = ref(db, 'lectures');
    
                    // Use onValue to listen for changes in the data
                    onValue(lecturesRef, (snapshot) => {
                        const lecturesData = [];
    
                        // Check if data exists before processing
                        if (snapshot.exists()) {
                            snapshot.forEach((childSnapshot) => {
                                const lecture = childSnapshot.val();
    
                                // Check if the lecture belongs to the logged-in user and the specific subject
                                if (lecture.subjectId === subjectID) {
                                    lecturesData.push(lecture);
                                }
                            });
    
                            setLectures(lecturesData);
                        }
                    });
                });
    
                return () => {
                    // Clean up the subscription on component unmount
                    unsubscribeAuth();
                };
            } catch (error) {
                console.error('Error fetching lectures:', error);
            }
        };
    
        fetchData();
    }, [subjectID]);

    return (
        <div>
            <Sidemenu />
            <section>
                <div className="container">
                    <div className="cards">
                        {lectures.map((lecture, i) => (
                            <div key={i} className="card1">
                                <div
                                    className="card-button1"
                                    onClick={() => handleCardClick(lecture.lectureNumber)}
                                >
                                    <span>Lecture No: {lecture.lectureNumber}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ViewSubject;
