import React from 'react'
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Header from '../components/Header'
import img1 from '../images/profile.jpg'
import Sidebar from '../components/Sidebar'
export default function() {
  return (

    <section className='editprof'>
    <Header/>
    <Sidebar/>
    <Sidebar/>
    <Footer/>
   
    <div className="register2">
    
      <div className="col-1">
      <h1>Edit Profile</h1>

        <img src={img1} height={100} width={100}  />
        <form id='form' className='flex flex-col'>
          
          <label>Name </label> <input type='text'  required className='placeholder'/>
          <label>Email </label> <input type='text'  required className='placeholder'/>
          <label>Student ID </label> <input type='text'  required className='placeholder'/>
          <label>NIC </label> <input type='text'  required className='placeholder'/>
          <label>Contact Number </label> <input type='text'  required className='placeholder'/>
          
          
          <button className='btn'>Save</button>
          
        </form>
        

      </div>
    

    </div>    
  </section>

  )

}