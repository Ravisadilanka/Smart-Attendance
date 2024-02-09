import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { auth, db, signIn } from '../../firebase'; // Import your Firebase configuration
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { onAuthStateChanged } from 'firebase/auth';
import { get, ref } from 'firebase/database';
import background from '../Images/backgd.png';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [userData, setUserData] = useState({})

  const onSubmit = async (data) => {
    try {
      const user = await signIn(data.email, data.password);
      console.log('User logged in successfully', user);
      // Redirect user to the dashboard or home page after successful login
    } catch (error) {
      console.error(error);
      setError('Failed to log in. Please check your credentials.');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
          if (user) {
            const userRef = ref(db, `users/${user.uid}`);
            const userSnapshot = await get(userRef);
            const userDataFromFirebase = userSnapshot.val();

            // console.log('User Data:', userDataFromFirebase);

            if (userDataFromFirebase && userDataFromFirebase.adminId) {
              navigate('/admin_dashboard');
            } else if (userDataFromFirebase && userDataFromFirebase.staffId) {
              navigate('/dashboard');
            } else {
              // If no adminId or staffId, check "Students" database for matching email
              const studentsRef = ref(db, 'Students');
              const studentsSnapshot = await get(studentsRef);
              const studentsDataFromFirebase = studentsSnapshot.val();

              if (studentsDataFromFirebase) {
                // Iterate through the nodes in "Students" database
                Object.keys(studentsDataFromFirebase).forEach((manualUniqueId) => {
                  const studentNode = studentsDataFromFirebase[manualUniqueId];

                  // Check if the student node has the "email" property
                  if (studentNode.email && studentNode.email === user.email) {
                    // console.log('Student Data Found:', studentNode);
                    navigate('/student_dashboard');
                    return;
                  }
                });

                console.error('User data not found in "Students" database');
                // Handle accordingly, redirect to login or show a message
              } else {
                console.error('No data found in "Students" database');
                // Handle accordingly, redirect to login or show a message
              }
            }
          } else {
            console.error('No authenticated user');
            // Handle accordingly, redirect to login or show a message
          }
        });

        // Don't forget to unsubscribe when the component unmounts
        return () => unsubscribeAuth();
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    // Call the fetchUserData function
    fetchUserData();
  }, []); 




  return (
    <div>
      <img src={background} alt="Background Image" className="image" />
      <div className="col-1-log">
        <form id='form' className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder='Email'
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email format',
              },
            })}
          />
          {errors.email && <span className="error" style={{ color: 'red' }}>{errors.email.message}</span>}

          <input
            type="password"
            placeholder='Password'
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <span className="error" style={{ color: 'red' }}>{errors.password.message}</span>}

          <button type="submit" className='btn'>Log In</button>
        </form>
        {error && <div className='error-msg'>{error}</div>}

        <div className="additional-links">
          <Link to="/forgot_password">Forgot Password?</Link>
          <span> | </span>
          <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  )
}