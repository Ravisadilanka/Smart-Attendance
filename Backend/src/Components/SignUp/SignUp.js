import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { auth } from '../../firebase'; // Import your Firebase configuration
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, set } from "firebase/database";
import './SignUp.css'

export default function Signup() {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();
  const [error, setError] = useState('')
  const [formVisible, setFormVisible] = useState(true);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);

      const db = getDatabase();
      const userRef = ref(db, "users/" + auth.currentUser.uid);
      set(userRef, {
        name: data.name,
        staffId: data.staffId,
        nicNumber: data.nicNumber,
        email: data.email,
      });

      console.log('User created successfully');
      setError('User created successfully')
      setFormVisible(false);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.log(error.message);
      const errorMessage = error.message.split('Error (')[1].split(').')[0];
      setError(errorMessage)
      setFormVisible(true);
    }
  }; 

  return (
    <section>
      {error === 'User created successfully' && (<div class="success-checkmark">
            <div class="check-icon">
                <span class="icon-line line-tip"></span>
                <span class="icon-line line-long"></span>
                <div class="icon-circle"></div>
                <div class="icon-fix"></div>
            </div>
        </div>)}
      <div className={errors.name ? 'register register-error' : 'register'}>
        {formVisible && (<form id='form' className='flex flex-col' onSubmit={handleSubmit(onSubmit)} >
          {/* Form fields and error handling */}
          {error && <div className={error === 'User created successfully' ? 'error-msg success' : 'error-msg'}>{error}</div>}
          <input
            type="text"
            placeholder='Name'
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <span className="error" style={{color: 'red'}}>{errors.name.message}</span>}

          <input
            type="text"
            placeholder='Staff ID'
            {...register('staffId', {
              required: 'Staff ID is required',
              validate: (value) => Number.isInteger(Number(value)) || 'Invalid staff ID',
            })}
          />
          {errors.staffId && <span className="error" style={{color: 'red'}}>{errors.staffId.message}</span>}

          <input
            type="text"
            placeholder='NIC Number'
            {...register('nicNumber', { required: 'NIC Number is required' })}
          />
          {errors.nicNumber && <span className="error" style={{color: 'red'}}>{errors.nicNumber.message}</span>}

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
          {errors.email && <span className="error" style={{color: 'red'}}>{errors.email.message}</span>}

          <input
            type="password"
            placeholder='Password'
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <span className="error" style={{color: 'red'}}>{errors.password.message}</span>}

          <input
            type="password"
            placeholder='Confirm Password'
            {...register('confirmPassword', {
              required: 'Confirm Password is required',
              validate: (value) => value === getValues('password') || 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && <span className="error" style={{color: 'red'}}>{errors.confirmPassword.message}</span>}

          <button type="submit" className='btn'>Sign Up</button>
        </form>)}
      </div>
    </section>
  )
}