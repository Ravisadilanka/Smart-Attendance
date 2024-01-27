import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { onAuthStateChanged } from 'firebase/auth';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { auth, db } from '../firebase';
import { ref, push, set } from 'firebase/database';

export default function Add_Lecture() {
    const { subjectID } = useParams(); // Get the subjectID from the URL parameters
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => unsubscribe(); // Cleanup on component unmount
    }, []);

    const onSubmit = async (data) => {
      if (user) {
          const newLecture = {
              lectureNumber: data.lecnumber,
              date: data.Date,
              time: data.Time,
              numberOfStudents: data.number,
              venue: data.Venue,
              userId: user.uid,
              subjectId: subjectID,
          };
  
          const lecturesRef = ref(db, 'lectures');
  
          try {
            // Use push to add a new child with a unique key
            const newLectureRef = push(lecturesRef, newLecture);
            console.log('Lecture added successfully. Reference Key:', newLectureRef.key);
            // Optionally, you can redirect the user to the dashboard or perform other actions
              // Optionally, you can redirect the user to the dashboard or perform other actions
              navigate(`/Select_a_Subject/${subjectID}`);
          } catch (error) {
              console.error('Error adding lecture to Realtime Database:', error);
          }
      } else {
          console.error('User not logged in.');
      }
  };

  return (
    <div>
      <section>
        <div className="register2">
          <form id='form' className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
            <div className='form-row'>
              <label htmlFor="lecnumber">Lecture Number</label>
              <input
                type="number"
                placeholder='Add Lecture Number'
                {...register('lecnumber', {
                  required: 'Lecture number is required',
                  validate: (value) => Number.isInteger(Number(value)) || 'Invalid Value',
                })}
              />
            </div>
            <div className='form-row'>
            <label htmlFor="date">Date</label>
              {/* Use input type="date" for a standardized date picker */}
              <input
                type="date"
                {...register('Date', { required: 'Date is required' })}
              />
            </div>
            {errors.Date && <span className="error-row" style={{ color: 'red' }}>{errors.Date.message}</span>}

            <div className='form-row'>
              <label htmlFor="time">Time</label>
              {/* Use input type="time" for a standardized time input */}
              <input
                type="time"
                {...register('Time', { required: 'Time is required' })}
              />
            </div>
            {errors.Time && <span className="error-row" style={{ color: 'red' }}>{errors.Time.message}</span>}

            <div className='form-row'>
              <label htmlFor="number">Number of Students</label>
              <input
                type="number"
                placeholder='Add Number of Students'
                {...register('number', {
                  required: 'Number of Students is required',
                  validate: (value) => Number.isInteger(Number(value)) || 'Invalid Value',
                })}
              />
            </div>
            {errors.number && <span className="error-row" style={{ color: 'red' }}>{errors.number.message}</span>}

            <div className='form-row'>
              <label htmlFor="date">Venue</label>
              <input
                type="text"
                placeholder='Add Venue'
                {...register('Venue', {
                  required: 'Venue is required',
                })}
              />
            </div>
            {errors.Venue && <span className="error-row" style={{ color: 'red' }}>{errors.Venue.message}</span>}

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
