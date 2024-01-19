import React from 'react'

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function 
() {
  return (

    <section>

    <Header/>
    <Sidebar/>
    <Footer/>
    <div className='academic-btn-section'>
       <button className='academic-btn'>17/18 YEAR</button>
       <button className='academic-btn'>18/19 YEAR</button>
       <button className='academic-btn'>19/20 YEAR</button>
       <button className='academic-btn'>20/21 YEAR</button>
       <button className='logout-btn'>Log out</button>
    </div>

    </section>
  )
}
