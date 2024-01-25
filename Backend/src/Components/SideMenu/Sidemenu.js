import React, { useState } from 'react';
import './Sidemenu.css';
import { Link } from 'react-router-dom';
import { MdOutlineDashboard } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
import { auth } from '../../firebase'; 
import { useNavigate } from 'react-router-dom';

const Sidemenu = () => {
  const [activeLink, setActiveLink] = useState('dashboard');
  const navigate = useNavigate();

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const handleLogout = async () => {
    try {
        await auth.signOut();
        // Redirect to the login page or any other page after logout
        navigate('/');
    } catch (error) {
        console.error('Error logging out:', error);
    }
};


  return (
    <div className='sidebar'>
      <ul>
        <li className={activeLink === 'dashboard' ? 'active' : ''}>
          <Link to="/dashboard" onClick={() => handleLinkClick('dashboard')}>
            <span><MdOutlineDashboard /></span> {' '} Dashboard</Link>
        </li>
        <li className={activeLink === 'notifications' ? 'active' : ''}>
          <Link to="/notifications" onClick={() => handleLinkClick('notifications')}><span><IoIosNotifications /></span>Notifications</Link>
        </li>
        <li className={activeLink === 'profile' ? 'active' : ''}>
          <Link to="/profile" onClick={() => handleLinkClick('profile')}><span><CgProfile /></span>User Profile </Link>
        </li>
        <li>
          <Link onClick={handleLogout}><span><IoIosLogOut /></span>Logout </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidemenu;
