import { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { ref, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import Sidemenu from '../SideMenu/Sidemenu';


export default function StudentAnalytics() {
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();
  const [academicYear, setAcademicYear] = useState('')

  const handleCardClick = (subjectID) => {
    navigate(`/analytics/${subjectID}`);
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          console.log('User is not logged in.');
          navigate('/');
          return;
        }

        const userEmail = user.email;
        console.log(user.email);

        if (!userEmail) {
          console.log('User email not found.');
          return;
        }

        // Check if the user's email is in the Students database
        const studentsRef = ref(db, 'Students');
        const studentsSnapshot = await get(studentsRef);
        console.log('Students data:', studentsSnapshot.val()); // Log students data

        if (studentsSnapshot.exists()) {
          studentsSnapshot.forEach((studentSnapshot) => {
            const studentData = studentSnapshot.val();
            console.log('Student data:', studentData); // Log individual student data
            if ('email' in studentData && studentData.email === userEmail) {
              setAcademicYear(studentData.AcademicYear);
              console.log(academicYear.split('/')[0]);
            }
          });
        }

        // Fetch subjects based on academic year
        const subjectsRef = ref(db, 'subjects');
        const subjectsSnapshot = await get(subjectsRef);

        const filteredSubjects = [];

        if (subjectsSnapshot.exists()) {
          subjectsSnapshot.forEach((subjectSnapshot) => {
            const subjectData = subjectSnapshot.val();

            // Extract academic year from the subject and compare
            console.log(subjectData.Year); // Log subject year
            if (subjectData.Year === academicYear.split('/')[0]) {
              filteredSubjects.push(subjectData);
            }
          });

          setSubjects(filteredSubjects);
        }
      } catch (error) {
        console.error('Error fetching student subjects:', error);
      }
    };

    fetchData();
  }, [navigate, academicYear]);

  return (
    <div>
      {/* Render the relevant subjects for the student */}
      <Sidemenu />
      <div className='cards'>
        {subjects.map((subject, i) =>
        (
          <div key={i} className='card' onClick={(e) => handleCardClick(e, subject.subjectID)}>
            <h2>{subject.subjectID}</h2>
            <h3>{subject.subjectName}</h3>
            <h5>{subject.Year}</h5>
            <h5>{subject.subjectRef}</h5>
          </div>
        )
        )}
      </div>
    </div>
  );
}