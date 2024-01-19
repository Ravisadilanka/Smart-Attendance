import React from 'react'
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function 
() {
  return (
    <div>
         <section>

<Header/>
<Sidebar/>
<Footer/>


<div className='subject-section'>
   <button className='Subject-btn'>Digital Innovation</button>
   <button className='Subject-btn'>E-Business</button>
   <button className='Subject-btn'>Data Structures & Algorithms</button>
   <button className='Subject-btn'>IS Risk Mangement</button>
   <button className='Subject-btn'>IT Governance</button>
   <button className='Subject-btn'>Academic English</button>
  
   
</div>

</section>
    </div>
  )
}
