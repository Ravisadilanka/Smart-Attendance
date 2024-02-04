import React from 'react'
import './dashboard.css'
import Sidemenu from '../SideMenu/Sidemenu'
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {

  const navigate = useNavigate();

  const handleStaff = () => {
    navigate('/view_staffdetails');
  };

  return (
    <section>
    <Sidemenu />
      <div className='dashboard-btn-section'>
        <button className='dashboard-btn' onClick={handleStaff}>Staff</button>
        <button className='dashboard-btn'>Students</button>
      </div>
    </section>
  )
}