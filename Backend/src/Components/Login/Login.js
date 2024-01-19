import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from '../../firebase'; // Import your Firebase configuration
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const user = await signIn(data.email, data.password);
      console.log('User logged in successfully', user);
      // Redirect user to the dashboard or home page after successful login
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setError('Failed to log in. Please check your credentials.');
    }
  };

  return (
    <div className='registerLog'>
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
          <Link to="/forgot-password">Forgot Password?</Link>
          <span> | </span>
          <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  )
}
