import { useState, useEffect } from 'react';
import { VscError } from 'react-icons/vsc';
import { db, auth } from '../firebase';
import { ref, onValue, remove } from 'firebase/database';
import ConfirmationModal from '../Components/ConfirmationModal/ConfirmationModal';
import { useNavigate, useParams } from 'react-router-dom';
import Sidemenu from './SideMenu/Sidemenu';
import { onAuthStateChanged } from 'firebase/auth';
import './Select_Subject.css';

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
      const lecturesRef = ref(db, 'lectures');

      onValue(lecturesRef, (snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const lecture = childSnapshot.val();

            if (user.uid === lecture.userId && lecture.lectureID === lectureID) {
              remove(childSnapshot.ref);
              console.log('Lecture deleted successfully.');
            }
          });

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
      handleDeleteLecture(lectureToDelete);
      setLectureToDelete(null);
    }
    setIsModalOpen(false);
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
            return;
          }

          const lecturesRef = ref(db, 'lectures');

          onValue(lecturesRef, (snapshot) => {
            const lecturesData = [];

            if (snapshot.exists()) {
              snapshot.forEach((childSnapshot) => {
                const lecture = childSnapshot.val();

                if (user.uid === lecture.userId && lecture.subjectId === subjectID) {
                  lecturesData.push(lecture);
                }
              });

              setLectures(lecturesData);
            }
          });
        });

        return () => {
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
              <div key={i} className="card">
                <div className="card-button" onClick={() => handleCardClick(lecture.lectureNumber)}>
                  <span>Lecture Number: {lecture.lectureNumber}</span>
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
        <button className="bottom-button3" onClick={handleClick}>Add more Lectures</button>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
