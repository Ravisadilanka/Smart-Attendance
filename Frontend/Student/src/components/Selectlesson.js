import React, { useState } from 'react';
import './Selectlesson.css';
import Sidedefault from './Sidedefault';


const Selectlesson = () => {
  const [formData, setFormData] = useState({
    Date: '',
    Time: '',
    YourAttendance: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Form submitted:', formData);
  };

  return (
      <div className="form-container">
        <Sidedefault/>
      <form onSubmit={handleSubmit}>
      

        <label>
          Date: 
          <input
            type="text"
            name="date"
            placeholder="Lecture 01"
            value={formData.firstName}
            onChange={handleChange}
          />
        </label>

        <label>
          Time:
          <input
            type="text"
            name="time"
            placeholder='Add Text'
            value={formData.lastName}
            onChange={handleChange}
          />
        </label>

        <label>
          Your Attendance:
          <input
            type="text"
            name="yourattendance"
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Enter</button>
      </form>
    </div>
  );
};

export default Selectlesson;


/*

import React from 'react';
import { useForm } from 'react-hook-form';
import './Selectlesson.css';
import Sidedefault from './Sidedefault';


export default function Forgetpassword() {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();

  const onSubmit = (data) => {
    // Handle form submission logic here
    console.log(data);
  };

  return (
    <div className='signit'>
      <Sidedefault/>
      <div className="newpage">
        <form id='newfrm' className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
          <input
            type="date"
            name="Date"
            placeholder='Lecture 01'
            {...register('Date', { required: 'Date is required' })}
          />
          {errors.Date && <span className="error" style={{color: 'red'}}>{errors.Date.message}</span>}


          <input
            type="Add text"
            name='Time'
            placeholder='Add text'
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
            name='Your Attendance'
            placeholder='Pass'
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <span className="error" style={{color: 'red'}}>{errors.password.message}</span>}


          <button type="submit" className='signbtn'>Enter</button>
        </form>
      </div>
    </div>
  )
}

*/