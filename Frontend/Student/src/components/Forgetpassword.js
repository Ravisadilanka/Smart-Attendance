import React from 'react';
import { useForm } from 'react-hook-form';

export default function Forgetpassword() {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();

  const onSubmit = (data) => {
    // Handle form submission logic here
    console.log(data);
  };

  return (
    <div className='signit'>
      <div className="newpage">
        <form id='newfrm' className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder='Register Number'
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <span className="error" style={{color: 'red'}}>{errors.name.message}</span>}


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
              validate: (value) => value === getValues('password') ? undefined : 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && <span className="error" style={{color: 'red'}}>{errors.confirmPassword.message}</span>}

          <button type="submit" className='signbtn'>Sign Up</button>
        </form>
      </div>
    </div>
  )
}