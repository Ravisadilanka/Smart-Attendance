import React from 'react';
import './SignUp.css';
import { useForm } from 'react-hook-form';

export default function Form() {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <section>
      <div className="register">
        <form id='form' className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
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
        </form>
      </div>
    </section>
  )
}
