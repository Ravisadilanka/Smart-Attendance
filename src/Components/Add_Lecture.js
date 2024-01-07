import React from 'react'
import { useForm } from 'react-hook-form';

export default function Add_Lecture() {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();

  const onSubmit = (data) => {
    // Handle form submission logic here
    console.log(data);
  };
  return (
    <div>
      <section>
      <div className="register2">
        <form id='form' className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>

          <div className='form-row'>
        <label htmlFor="date">Date</label>
          <input
            type="text"
            placeholder='Add Date'
            {...register('Date', { required: 'Date is required' })}
          />
          </div>
          {errors.Date && <span className="error-row" style={{color: 'red'}}>{errors.Date.message}</span>}
          

          <div className='form-row'>
        <label htmlFor="time">Time</label>
          <input
            type="text"
            placeholder='Add Time'
            {...register('Time', {
              required: 'Time is required',})}
          />
           </div>
          {errors.Time && <span className="error-row" style={{color: 'red'}}>{errors.Time.message}</span>}
         

          <div className='form-row'>
        <label htmlFor="number">Number of Students</label>
          <input
            type="text"
            placeholder='Add Number of Students'
            {...register('number', { required: 'Number of Students is required',
            validate: (value) => Number.isInteger(Number(value)) || 'Invalid Value',
            })}
          />
          </div>
          {errors.number && <span className="error-row" style={{color: 'red'}}>{errors.number.message}</span>}
          

          <div className='form-row'>
        <label htmlFor="date">Venue</label>
          <input
            type="text"
            placeholder='Add Venue'
            {...register('Venue', {
              required: 'Venue is required',})}
          />
          </div>
          {errors.Venue && <span className="error-row" style={{color: 'red'}}>{errors.Venue.message}</span>}
      

          
          <button type="submit" className='btn'>Create</button>
        </form>
      </div>
    </section>
    </div>
  )
}
