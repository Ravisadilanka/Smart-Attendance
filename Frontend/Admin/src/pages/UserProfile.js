import React from 'react'
import Sidebar from '../components/Sidebar';
// import Footer from '../components/Footer';
import Header from '../components/Header'
import img1 from '../images/profile.jpg'
import '../../src/UserProfile.css'

export default function() {
  return (

    <section className='editprof'>
    <Header/>
    <Sidebar/>
    
    
   
    <div className="register2">
    
      <div className="col-1">
      <h1>User Profile</h1>

        <img src={img1} height={100} width={100}  />
        <form id='form' className='flex flex-col'>
          
          <div id='input-item'>
              <input type='text'  required className='text-area' placeholder='Saman Perera'/>
          </div>

          <div id='input-item'>
             <input type='text'  required className='text-area' placeholder='samanperera@gmail.com'/>
          </div>

          <div id='input-item'>
             <input type='text'  required className='text-area' placeholder='112'/>
          </div>


          <div id='input-item'>
             <input type='text'  required className='text-area' placeholder='9918602516v'/>
          </div>


          <div id='input-item'>
             <input type='text'  required className='text-area' placeholder='0718737305'/>
          </div>
          
         
          
          
          
          
          <button className='btn'>Edit</button>
          
        </form>
        

      </div>
    

    </div>    
  </section>

  )

}