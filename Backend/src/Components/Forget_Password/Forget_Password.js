import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../../firebase';
import './Forget_Password.css';

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleForgetPassword = async () => {
    try {
      await resetPassword(email);
      setSuccessMessage('Password reset email sent successfully. Check your email inbox.');
      setErrorMessage('');
      setTimeout(() => {
        navigate('/');
      }, 10000);
    } catch (error) {
      setErrorMessage('Error sending password reset email. Please check your email address.');
      setSuccessMessage('');
      console.error('Error sending password reset email:', error);
    }
  };

  const handleSignUp = () => {
    navigate('/');
  };

  return (
    <section className='forgetpw'>
      <div className="register">
        <div className="col-1">
          <h1>Forget Password</h1>
          <form id='form' className='flex flex-col forgetpw'>
            <input
              type='email'
              placeholder='Email Address'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className={errorMessage ? "error-message" : ""}>{errorMessage}</span>
            <span className={successMessage ? "success-message" : ""}>{successMessage}</span>
            <button className='btn1' type="button" onClick={handleForgetPassword}>
              Send Password Reset Email
            </button>
            <button className='btn2' onClick={handleSignUp}>
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
