import React from 'react'
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
// import Footer from '../components/Footer';

export default function 
() {
  return (
    <section>
      <Header/>
      <Sidebar/>
      {/* <Footer/> */}
      <div className='row-1'>
       <div className='col-2'>

        <button className='Subject-subject'>Lesson 01</button>
        <button className='Subject-subject'>Lesson 02</button>
        <button className='Subject-subject'>Lesson 03</button>
         
       </div>


       <div className='col-2'>

          <button className='Subject-subject'>Lesson 04</button>
          <button className='Subject-subject'>Lesson 05</button>
          <button className='Subject-subject'>Lesson 06</button>
 
      </div>
        


      </div>
         




    </section>
  )
}
