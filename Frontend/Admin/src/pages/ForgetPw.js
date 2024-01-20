
import React from 'react'
import '../../src/ForgetPw.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
// import Footer from '../components/Footer';

export default function () {
  return (
    <section className='forgetpw'>
      <Header/>
      <Sidebar/>
      {/* <Footer/> */}
      <div className="register">
        <div className="col-1">
          <h1>Forget Password</h1>
 
          <form id='form' className='flex flex-col'>
            
            <input type='text' placeholder='Registration Number' required/>
            <input type='text' placeholder='Email Address' required/>
            <input type='text' placeholder='New Password' required/>
            <input type='text' placeholder='Confirm Password' required/>
            
            
            <button className='btn'>sign Up</button>
            
          </form>
          

        </div>
      

      </div>    
    </section>
  )
}