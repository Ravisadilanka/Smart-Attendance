import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { onAuthStateChanged } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase'; // Import both auth and db
import { ref, push } from 'firebase/database';

export default function AddSubject() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, []);

  const handleAddSubject = async (data) => {
    if (user) {
        const newSubject = {
          title: 'New Subject',
          subjectID: data.subjectID,
          subjectName: data.subjectName,
          Year: data.Year,
          userId: user.uid,
        };
        console.log('DB Object:', db);
        const subjectsRef = ref(db, 'subjects');
  
        try {
          // Use push to add a new child with a unique key
          const newSubjectRef = push(subjectsRef, newSubject);
          console.log('Subject added successfully. Reference Key:', newSubjectRef.key);
          // Optionally, you can redirect the user to the dashboard or perform other actions
          navigate('/dashboard');
        } catch (error) {
          console.error('Error adding subject to Realtime Database:', error);
        }
    } else {
      console.error('User not logged in.');
    }
  };

  return (
    <div>
      <section>
        <div className="register2">
          <form id='form' className='flex flex-col' onSubmit={handleSubmit(handleAddSubject)}>
            <input
              type="text"
              placeholder='Subject ID'
              {...register('subjectID', { required: 'Subject ID is required' })}
            />
            {errors.subjectID && <span className="error" style={{ color: 'red' }}>{errors.subjectID.message}</span>}

            <input
              type="text"
              placeholder='Subject Name'
              {...register('subjectName', {
                required: 'Subject Name is required'
              })}
            />
            {errors.subjectName && <span className="error" style={{ color: 'red' }}>{errors.subjectName.message}</span>}

            <input
              type="text"
              placeholder='Year'
              {...register('Year', {
                required: 'Year is required',
                validate: (value) => Number.isInteger(Number(value)) || 'Invalid Value',
              })}
            />
            {errors.Year && <span className="error" style={{ color: 'red' }}>{errors.Year.message}</span>}
            <button type="submit" className='btn'>Create</button>
          </form>
        </div>
      </section>
      <div>
        <Link to="/dashboard">Back to Dashboard</Link>
      </div>
    </div>
  );
}