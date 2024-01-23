import React from 'react'

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
// import Footer from '../components/Footer';
import '../../src/dashboard.css'

export default function 
() {
  return (

    <section>

    <Header/>
    <Sidebar/>
    {/* <Footer/> */}
    <div className='dashboard-btn-section'>
       <button className='dashboard-btn'>Staff</button>
       <button className='dashboard-btn'>Students</button>
      
       <button className='logout-btn'>Log out</button>
    </div>

    </section>
  )
}