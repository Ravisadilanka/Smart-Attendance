import React from 'react'
import Sidedefault from './Sidedefault';
import './Notifications.css';

function Notification02()
{
    return(
       <div>
       <div className='setit'>
       <h1><center>Notifications</center></h1>
       </div>
       <div className='notification-01'>
       <Sidedefault/>
       <div className='not-01'>
        You have an Operating Systems lecture at 1pm at Z9 Hall
        <p>07-07-2023 06:48am</p>
        </div>
        <div className='not-01'>
        You have Data Structures & Algorithms lecture at 10 am at NLH
        <p>07-07-2023  09:32am</p>
        </div>
        <div className='not-01'>
        You have a Software Engineering lecture at 08am at CIS Lab 01
        <p>07-07-2023  06:12am</p>
        </div>
        <div className='not-01'>
        You have an E-commerce lecture at 3 pm at Applied hall 02
        <p>06-07-2023  09:03am</p>
        </div>
        <div className='not-01'>
        You have a Procurement Management lecture at 10 am at Z9 hall
        <p>06-07-2023  7:28am</p>
        </div>
        </div>
        
        <button className='butn1'>Back</button>
        <button className='butn2'>See More</button>
        
      </div>
    )
}

export default Notification02;