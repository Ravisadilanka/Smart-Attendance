import React, { useState, useEffect } from 'react';
import './Sidemenu.css';
import { Link } from 'react-router-dom';
import { MdOutlineDashboard } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
import { auth, db } from '../../firebase'; 
import { useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';

const Sidemenu = () => {
  const [activeLink, setActiveLink] = useState('dashboard');
  const [upcomingLecturesCount, setUpcomingLecturesCount] = useState(0);
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

  useEffect(() => {
    const fetchUpcomingLecturesCount = async () => {
      try {
        const currentTime = new Date();
        const halfAnHourLater = new Date(currentTime.getTime() + 30 * 60 * 1000);
    
        const lecturesRef = ref(db, 'lectures'); // use ref here
        const snapshot = await get(lecturesRef); // use get here
    
        const upcomingLectures = [];
        snapshot.forEach((childSnapshot) => {
          const lectureData = childSnapshot.val();
          const lectureStartTime = new Date(`${lectureData.date}T${lectureData.startingTime}`);
          if (lectureStartTime > currentTime && lectureStartTime <= halfAnHourLater) {
            upcomingLectures.push(lectureData);
          }
        });
    
        setUpcomingLecturesCount(upcomingLectures.length);
      } catch (error) {
        console.error('Error fetching upcoming lectures count:', error);
      }
    };

    fetchUpcomingLecturesCount();
  }, []);

  return (
    <div className='sidebar'>
      <ul>
        <li className={activeLink === 'dashboard' ? 'active' : ''}>
          <Link to="/dashboard" onClick={() => handleLinkClick('dashboard')}>
            <span><MdOutlineDashboard /></span> {' '} Dashboard</Link>
        </li>
        <li className={activeLink === 'notifications' ? 'active' : ''}>
          <Link to="/notifications" onClick={() => handleLinkClick('notifications')}>
            <span><IoIosNotifications /></span>Notifications
            {upcomingLecturesCount > 0 && <span className="notification-count">{upcomingLecturesCount}</span>}
          </Link>
        </li>
        <li className={activeLink === 'profile' ? 'active' : ''}>
          <Link to="/profile" onClick={() => handleLinkClick('profile')}>
            <span><CgProfile /></span>User Profile
          </Link>
        </li>
        <li>
          <Link onClick={handleLogout}><span><IoIosLogOut /></span>Logout </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidemenu;
