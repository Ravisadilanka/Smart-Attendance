import React, { useState, useEffect } from 'react';
import Sidemenu from '../SideMenu/Sidemenu';
import { auth, db } from '../../firebase';
import { ref, get } from 'firebase/database';

import './UserProfile.css';

export default function UserProfile() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    nicNumber: '',
    staffId: '',
    // Add other user data fields here
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;

        if (currentUser) {
          const userRef = ref(db, `users/${currentUser.uid}`);

          const snapshot = await get(userRef);
          const userDataFromFirebase = snapshot.val();

          setUserData(userDataFromFirebase || {});
        } else {
          console.error('No authenticated user');
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserData();
  }, []);  

  const handleChange = (e) => {
    // Handle changes to input fields if needed
  };

  return (
    <section className='editprof'>
      <Sidemenu />

      <div className="register2">
        <div className="col-1">
          <h1>User Profile</h1>

          <form id='form' className='flex flex-col form'>
            <div id='input-item'>
              <input
                type='text'
                id='name'
                required
                className='text-area'
                placeholder='Name'
                value={userData.name}
                onChange={handleChange}
                readOnly
              />
            </div>

            <div id='input-item'>
              <input
                type='text'
                id='email'
                required
                className='text-area'
                placeholder='Email'
                value={userData.email}
                onChange={handleChange}
                readOnly
              />
            </div>
            <div id='input-item'>
              <input
                type='text'
                id='nicNumber'
                required
                className='text-area'
                placeholder='NIC Number'
                value={userData.nicNumber}
                onChange={handleChange}
                readOnly
              />
            </div>
            <div id='input-item'>
              <input
                type='text'
                id='staffId'
                required
                className='text-area'
                placeholder='Staff ID'
                value={userData.staffId}
                onChange={handleChange}
                readOnly
              />
            </div>

            {/* Add similar input fields for other user details from the Firebase database */}

            <button className='userprof-btn' type="button" onClick={enableEdit}>
              Edit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function enableEdit() {
  console.log('Edit button clicked');
}
