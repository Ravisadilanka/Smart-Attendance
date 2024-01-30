import React from 'react';
import './EditStaff.css';

export default function EditStaff() {
  return (
    <section className='editprof'>
      <div className="register2">
        <div className="col-1">
          <h1>Edit Staff</h1>
          <form id='form' className='flex flex-col form'>

            <div id='name-input-item'>
              <input type='text' required className='text-area' placeholder='Saman Perera' />
            </div>

            <div id='email-input-item'>
              <input type='text' required className='text-area' placeholder='samanperera@gmail.com' />
            </div>

            <div id='id-input-item'>
              <input type='text' required className='text-area' placeholder='112' />
            </div>

            <div id='nic-input-item'>
              <input type='text' required className='text-area' placeholder='9918602516v' />
            </div>

            <div id='phone-input-item'>
              <input type='text' required className='text-area' placeholder='0718737305' />
            </div>

            <button className='editstaff-btn'>Save</button>

          </form>
        </div>
      </div>
    </section>
  );
}
