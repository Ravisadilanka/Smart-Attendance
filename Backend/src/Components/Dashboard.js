import { useState, useEffect } from 'react';
import { VscError } from 'react-icons/vsc';
import { db, auth } from '../firebase'; // Import your firebase configuration
import { ref, onValue, child, get,  remove} from 'firebase/database';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/Add_Subject');
  };

  const handleDelete = async (subjectId) => {
    console.log('Deleting subject:', subjectId);
    const user = auth.currentUser;
  
    if (!user || !user.uid) {
      console.error('User not logged in.');
      return;
    }
  
    const subjectRef = ref(db, `subjects/${subjectId}`);
  
    try {
      await remove(subjectRef);
      console.log('Subject deleted successfully.');
  
      // Remove the subject from the local state based on the firebaseId
      setSubjects((prevSubjects) => prevSubjects.filter((subject) => subject.firebaseId !== subjectId));
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };  
  
  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      // No user is logged in, handle this case accordingly
      console.log('No user is logged in.');
      return;
    }

    // Reference to the 'subjects' node in the database
    const subjectsRef = ref(db, 'subjects');

    // Fetch data from the real-time database for the specific user
    const fetchData = async () => {
      try {
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
              }
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
                  <VscError onClick={() => handleDelete(subject.subjectID)}/>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="button-container">
        <button className="bottom-button" onClick={handleClick}>
          Add more Subjects
        </button>
      </div>
    </div>
  );
}