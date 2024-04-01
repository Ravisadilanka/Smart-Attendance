import React, { useState, useEffect } from 'react';
import Sidemenu from '../SideMenu/Sidemenu';
import { auth, db } from '../../firebase';
import { ref, get, update } from 'firebase/database';

import './UserProfile.css';
import { onAuthStateChanged } from 'firebase/auth';

export default function UserProfile() {
  const [userData, setUserData] = useState({
    name: '',
    nicNumber: '',
    Department: ''
  });

  const [editMode, setEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
          if (user) {
            const studentRef = ref(db, 'Students');
            const studentsSnapshot = await get(studentRef);

            const studentDataFromFirebase = studentsSnapshot.val();
            const studentEmails = Object.values(studentDataFromFirebase).map(student => student.email);

            if (studentEmails.includes(user.email)) {
              // User is a student
              const studentData = Object.values(studentDataFromFirebase)
                .find(student => student.email === user.email);

              setUserData(studentData || {});
            } else {
              // User is not a student, assuming Admin or Lecturer
              const userRef = ref(db, `users/${user.uid}`);
              const userSnapshot = await get(userRef);

              const userDataFromFirebase = userSnapshot.val();
              setUserData(userDataFromFirebase || {});
            }
          } else {
            console.error('No authenticated user');
            // Handle accordingly, redirect to login or show a message
          }
        });

        return () => {
          // Clean up the subscription on component unmount
          unsubscribeAuth();
        };
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [id]: value }));
  };

  const toggleEditMode = () => {
    setEditMode((prevEditMode) => !prevEditMode);
  };

  const saveChanges = async () => {
    try {
      const currentUser = auth.currentUser;
  
      if (currentUser) {
        let userRef;
  
        // Check if the user is a student
        const studentRef = ref(db, 'Students');
        const studentSnapshot = await get(studentRef);
        const studentDataFromFirebase = studentSnapshot.val();
        const studentEmails = Object.values(studentDataFromFirebase).map(student => student.email);
  
        if (studentEmails.includes(currentUser.email)) {
          // User is a student
          const studentData = Object.values(studentDataFromFirebase)
            .find(student => student.email === currentUser.email);
  
          userRef = ref(db, `Students/${studentData.id}`);
        } else {
          // User is not a student, assuming Admin or Lecturer
          userRef = ref(db, `users/${currentUser.uid}`);
        }
  
        // Update the user data in the database
        await update(userRef, userData);
  
        // Set edit mode back to false
        setEditMode(false);
  
        // Set success message
        setSuccessMessage('Changes saved successfully');
  
        // Clear any previous error message
        setErrorMessage('');
  
        // Clear success message after 10 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 10000);
      } else {
        console.error('No authenticated user');
      }
    } catch (error) {
      console.error('Error updating user data:', error.message);
  
      // Set error message
      setErrorMessage('Error saving changes. Please try again.');
  
      // Clear any previous success message
      setSuccessMessage('');
  
      // Clear error message after 10 seconds
      setTimeout(() => {
        setErrorMessage('');
      }, 1000);
    }
  };


  return (
    <section className='editprof'>
      <Sidemenu />

      <div className="register2">
        <div className="col-1">
          <h1>User Profile</h1>
          {successMessage && <p className="success">{successMessage}</p>}
            {errorMessage && <p className="error-msg">{errorMessage}</p>}

          <form id='form' className='flex flex-col form'>
            {userData.name ? <div id='input-item'>
              <input
                type='text'
                id='name'
                required
                className='text-area'
                placeholder='Name'
                value={userData.name}
                onChange={handleChange}
                readOnly={!editMode}
              />
            </div> : null}

            {userData.email ? <div id='input-item'>
              <input
                type='text'
                id='email'
                required
                className='text-area'
                placeholder='Email'
                value={userData.email}
              />
            </div> : null}

            {userData.nicNumber ? <div id='input-item'>
              <input
                type='text'
                id='nicNumber'
                required
                className='text-area'
                placeholder='NIC Number'
                value={userData.nicNumber}
                onChange={handleChange}
                readOnly={!editMode}
              />
            </div> : null}
            {userData.staffId ? <div id='input-item'>
              <input
                type='text'
                id='staffId'
                required
                className='text-area'
                placeholder='Staff ID'
                value={userData.staffId}
              />
            </div> : null}
            {userData.id ? <div id='input-item'>
              <input
                type='text'
                id='id'
                required
                className='text-area'
                placeholder='Student Id'
                value={userData.id}
              />
            </div> : null}
            {userData.Department ? <div id='input-item'>
              <input
                type='text'
                id='Department'
                required
                className='text-area'
                placeholder='Department'
                value={userData.Department}
                onChange={handleChange}
                readOnly={!editMode}
              />
            </div> : null}


            {editMode ? (
              <button className='userprof-btn' type="button" onClick={saveChanges}>
                Save
              </button>
            ) : (
              <button className='userprof-btn' type="button" onClick={toggleEditMode}>
                Edit
              </button>
            )}

            
          </form>
        </div>
      </div>
    </section>
  );
}