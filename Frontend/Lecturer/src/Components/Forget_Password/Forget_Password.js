import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Forget_Password.css';

export default function ForgetPassword() {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/Dashboard');
  };

  return (
    <section className='forgetpw'>
      <div className="register">
        <div className="col-1">
          <h1>Forget Password</h1>

          <form id='form' className='flex flex-col forgetpw'>
            <input type='text' placeholder='Registration Number' required />
            <input type='text' placeholder='Email Address' required />
            <input type='text' placeholder='New Password' required />
            <input type='text' placeholder='Confirm Password' required />

            <button className='btn' onClick={handleSignUp}>
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
