import React, { useState } from 'react';
import './Sidedefault.css';
import { Link } from 'react-router-dom';
import { MdOutlineDashboard } from 'react-icons/md';
import { IoIosNotifications, IoIosLogOut } from 'react-icons/io';
import { CgProfile } from 'react-icons/cg';

const Sidedefault = () => {
  const [activeLink, setActiveLink] = useState('dashboard');

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  return (
    <div className='sidebar'>
      <ul>
        <li className={activeLink === 'dashboard' ? 'active' : ''}>
          <Link to="/dashboard" onClick={() => handleLinkClick('dashboard')}>
            <span><MdOutlineDashboard /></span> {' '} Dashboard</Link>
        </li>
        <li className={activeLink === 'notifications' ? 'active' : ''}>
          <Link to="/Notification01" onClick={() => handleLinkClick('Notification01')}><span><IoIosNotifications /></span>Notifications</Link>
        </li>
        <li className={activeLink === 'profile' ? 'active' : ''}>
          <Link to="/profile" onClick={() => handleLinkClick('profile')}><span><CgProfile /></span>User Profile </Link>
        </li>
        <li>
          <Link to="/logout" onClick={() => handleLinkClick('logout')}><span><IoIosLogOut /></span>Logout </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidedefault;