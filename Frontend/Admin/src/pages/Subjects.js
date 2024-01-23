import React from 'react'
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';


import '../../src/Subject.css';
// import Footer from '../components/Footer';

export default function 
() {
  return (
    <div>
         <section>

<Header/>
<Sidebar/>
{/* <Footer/> */}


<div className='subject-section'>
 
 <div>
   <button className='Subject-btn'>Digital Innovation</button>
   <img class="corner-image" src=".jpg" alt="Corner Image"></img>
  
</div>
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
