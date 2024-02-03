import { useState, useEffect } from 'react';
import { VscError } from 'react-icons/vsc';
import { db, auth } from '../firebase';
import { ref, onValue, remove } from 'firebase/database';
import ConfirmationModal from '../Components/ConfirmationModal/ConfirmationModal';
import { useNavigate, useParams } from 'react-router-dom';
import Sidemenu from './SideMenu/Sidemenu';
import { onAuthStateChanged } from 'firebase/auth';

export default function Select_a_Subject() {
  const { subjectID } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lectures, setLectures] = useState([]);
  const [lectureToDelete, setLectureToDelete] = useState(null);
  const navigate = useNavigate();



  const handleClick = () => {
    navigate(`/Add_Lecture/${subjectID}`);
  };
  const handleCardClick = (lectureNumber) => {
    navigate(`/Attendance/${lectureNumber}`);
  };
  
  const handleDeleteLecture = async (lectureID) => {
    const user = auth.currentUser;

    if (!user || !user.uid) {
      console.error('User not logged in.');
      return;
    }

    try {
      // Reference to the 'lectures' node in the database
      const lecturesRef = ref(db, 'lectures');

      // Use onValue to listen for changes in the data
      onValue(lecturesRef, (snapshot) => {
        // Check if data exists before processing
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const lecture = childSnapshot.val();

            // Check if the lecture belongs to the logged-in user
            if (user.uid === lecture.userId && lecture.lectureID === lectureID) {
              // Remove the lecture from the real-time database
              remove(childSnapshot.ref);
              console.log('Lecture deleted successfully.');
            }
          });

          // Remove the lecture from the local state based on the lectureId
          setLectures((prevLectures) =>
            prevLectures.filter((lecture) => lecture.lectureID !== lectureID)
          );
        }
      });
    } catch (error) {
      console.error('Error deleting lecture:', error);
    }
  };

  const handleConfirmDelete = (lectureID) => {
    setLectureToDelete(lectureID);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (lectureToDelete) {
      // Call your delete function here
      handleDeleteLecture(lectureToDelete);
      // Reset lectureToDelete state
      setLectureToDelete(null);
    }
    setIsModalOpen(false); // Close the modal
  };

  const handleCloseModal = () => {
    setLectureToDelete(null);
    setIsModalOpen(false);
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
                            if (user.uid === lecture.userId && lecture.subjectId === subjectID) {
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
                <div className="card-button1" onClick={() => handleCardClick(lecture.lectureNumber)}>
                  <span>Lecture Number: {lecture.lectureNumber}</span>
                  {/* Add more details based on your data structure */}
                </div>
                <span className='icon-container'>
                  <VscError onClick={() => handleConfirmDelete(lecture.lectureID)} />
                </span>
              </div>

            ))}
          </div>
        </div>
      </section>
      <div className="button-container1">
        <button className="bottom-button1" onClick={handleClick}>Add more Lectures</button>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
