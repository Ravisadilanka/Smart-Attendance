import React from 'react'
import Sidebar from '../components/Sidebar';
// import Footer from '../components/Footer';
import Header from '../components/Header'
import img1 from '../images/profile.jpg'
import '../../src/EditProfile.css'

export default function() {
  return (

    <section className='editprof'>
    <Header/>
    <Sidebar/>
    
    
   
    <div className="register2">
    
      <div className="col-1">
      <h1>Edit Profile</h1>

        <img src={img1} height={100} width={100}  />
        <form id='form' className='flex flex-col editprof-form'>
          
          <div id='input-item'>

          <label>Name </label> 
          <input type='text'  required className='text-area'/>
          </div>

          <div id='input-item'>
          <label>Email </label> <input type='text'  required className='text-area'/>
          </div>
          <div id='input-item'>

          <label>Student ID </label> <input type='text'  required className='text-area'/>
          </div>
          <div id='input-item'>

          <label>NIC </label> <input type='text'  required className='text-area'/>
          </div>
          <div id='input-item'>

          <label>Contact Number </label> <input type='text'  required className='text-area'/>
          </div>
          
         
          
          
          
          
          <button className='btn'>Save</button>
          
        </form>
        

      </div>
    

    </div>    
  </section>

  )

}