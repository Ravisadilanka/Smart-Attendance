import React from 'react'
import './dashboard.css'
import Sidemenu from '../SideMenu/Sidemenu'

export default function AdminDashboard
  () {
  return (
    <section>
    <Sidemenu />
      <div className='dashboard-btn-section'>
        <button className='dashboard-btn'>Staff</button>
        <button className='dashboard-btn'>Students</button>
      </div>
    </section>
  )
}