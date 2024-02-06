import React, { useEffect, useState } from 'react';
import Sidemenu from '../SideMenu/Sidemenu';
import './AccademicYears.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { onValue, ref } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

export default function AccademicYears() {
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();

  const handleAcademicYear = (academicYear) => {
    const encodedAcademicYear = encodeURIComponent(academicYear);
    navigate(`/academic_years/${encodedAcademicYear}`);
  };
  useEffect(() => {
    const fetchUserData = async () => {
      const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const studentsRef = ref(db, 'Students');
            onValue(studentsRef, (snapshot) => {
              if (snapshot.exists()) {
                const studentsDataArray = Object.entries(snapshot.val()).map(([id, details]) => ({
                  id,
                  ...details,
                }));
                setUserData(studentsDataArray);
              } else {
                console.log('No students data available.');
              }
            });
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
      });

      return () => unsubscribeAuth();
    };

    fetchUserData();
  }, []);

  return (
    <section>
      <Sidemenu />
      <div className='academic-btn-section'>
        {Array.from(new Set(userData.map(student => student.AcademicYear))).map(academicYear => (
          <button key={academicYear} className='academic-btn' onClick={() => handleAcademicYear(academicYear)}>{academicYear}</button>
        ))}
      </div>
    </section>
  );
}
