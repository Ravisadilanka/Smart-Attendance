import React from 'react'
import './Notifications.css'
import Sidemenu from '../SideMenu/Sidemenu'

export default function Notification1() {
  return (
    <div>
       <div className='notification-01'>
        <Sidemenu/>
       <div className='not-01'>
        You have an Advanced Maths lecture at 8am at NLH
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
        You have an IT Auditing lecture at 1 pm at Z9 hall
        <p>08-07-2023  10:28am</p>
        </div>
        </div>
        <div className="button-container">
            <button className="bottom-button">See More</button>
            </div>
    </div>
  )
}
