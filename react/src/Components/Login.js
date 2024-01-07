import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { auth } from '../firebase'; // Import your Firebase configuration
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      console.log('User logged in successfully', user);
      // Redirect user to the dashboard or home page after successful login
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setError('Failed to log in. Please check your credentials.');
    }
  };

  return (
    <div className='register'>
      <div className="col-1">
        <h1>Smart Attendance System</h1>
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
        </div>
    </div>
  )
}