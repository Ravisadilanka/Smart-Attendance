import React from 'react'
import Sidebar from '../components/Sidebar';
// import Footer from '../components/Footer';
import Header from '../components/Header'
// import img1 from '../images/profile.jpg'
import '../../src/EditStaff.css'

export default function() {
  return (

    <section className='editprof'>
    <Header/>
    <Sidebar/>
    
    
   
    <div className="register2">
    
      <div className="col-1">
      <h1>Edit Staff</h1>

        
        <form id='form' className='flex flex-col form'>
          
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
          
         
          
          
          
          
          <button className='userprof-btn'>Edit</button>
          
        </form>
        

      </div>
    

    </div>    
  </section>

  )

}