import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Sidemenu from '../SideMenu/Sidemenu';
import './Add_Subject.css';

export default function Add_Subject() {
  const navigate = useNavigate(); 

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    navigate('/Dashboard');
  };

  return (
    <div>
      <Sidemenu/>
      <section>
        <div className="register3">
          <form id='form' className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder='Subject ID'
            {...register('subjectID', { required: 'Subject ID is required' })}
          />
          {errors.subjectID && <span className="error" style={{color: 'red'}}>{errors.subjectID.message}</span>}

          <input
            type="text"
            placeholder='Subject Name'
            {...register('subjectName', {
              required: 'Subject Name is required'})}
              />
          {errors.subjectName && <span className="error" style={{color: 'red'}}>{errors.subjectName.message}</span>}

          <input
            type="text"
            placeholder='Year'
            {...register('Year', { required: 'Year is required',
            validate: (value) => Number.isInteger(Number(value)) || 'Invalid Value', })}
          />
          {errors.Year && <span className="error" style={{color: 'red'}}>{errors.Year.message}</span>}


            <button type="submit" className='btn'>Create</button>
          </form>
        </div>
      </section>
    </div>
  );
}
