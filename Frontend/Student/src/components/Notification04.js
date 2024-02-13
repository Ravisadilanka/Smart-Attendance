import React from 'react'
import Sidedefault from './Sidedefault';
import './Notifications.css';

function Notification04()
{
    return(
       <div>
       <h1>Notifications</h1>
       <div className='notification-01'>
       <Sidedefault/>
       <div className='not-01'>
        You have a digital innovation lecture at 8am at NLH
        <p>11-07-2023 07:00am</p>
        </div>
        <div className='not-01'>
        You have IS Risk Management lecture at 1pm at Applied hall 01
        <p>09-07-2023  11:57am</p>
        </div>
        <div className='not-01'>
        You have a Web development lecture at 10am at CIS Lab01
        <p>09-07-2023  08:45am</p>
        </div>
        <div className='not-01'>
        You have a Digital Innovation lecture at 8am at NLH
        <p>09-07-2023  07:03am</p>
        </div>
        <div className='not-01'>
        You have a Digital Innovation lecture at 1 pm at Z9 hall
        <p>08-07-2023  10:28am</p>
        </div>
        </div>
        
        <button className='butn1'>Back</button>
        <button className='butn2'>See More</button>
        
      </div>
    )
}

export default Notification04;