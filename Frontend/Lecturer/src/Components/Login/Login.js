import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import background from './Images/backgd.png';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log('Form data submitted:', data);
    navigate('/dashboard');
  };

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
          {/* Use Link to navigate to the forgot-password page */}
          <Link to="/Forget_Password">Forgot Password?</Link>
          <span> | </span>
          {/* Use Link to navigate to the signup page */}
          <Link to="/Form">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
