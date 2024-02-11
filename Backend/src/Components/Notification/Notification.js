import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../../firebase';
import Sidemenu from '../SideMenu/Sidemenu';
import './Notification.css';

const Notification = () => {
    const [upcomingLectures, setUpcomingLectures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUpcomingLectures = async () => {
            try {
                const currentTime = new Date();
                const halfAnHourLater = new Date(currentTime.getTime() + 30 * 60 * 1000);

                const lecturesRef = ref(db, 'lectures');
                const snapshot = await get(lecturesRef);

                const upcomingLecturesData = [];
                snapshot.forEach((lectureSnapshot) => {
                    const lectureData = lectureSnapshot.val();
                    const lectureKey = lectureSnapshot.key;

                    const lectureStartTime = new Date(`${lectureData.date}T${lectureData.startingTime}`);
                    if (lectureStartTime > currentTime && lectureStartTime <= halfAnHourLater) {
                        upcomingLecturesData.push({ ...lectureData, key: lectureKey });
                    }
                });

                setUpcomingLectures(upcomingLecturesData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching upcoming lectures:', error);
                setError('Failed to fetch upcoming lectures. Please try again later.');
                setLoading(false);
            }
        };

        fetchUpcomingLectures();

        const intervalId = setInterval(fetchUpcomingLectures, 5 * 60 * 1000); // Fetch every 5 minutes

        return () => clearInterval(intervalId); // Clear interval on component unmount
    }, []);

    return (
        <div className="notification-container">
            <Sidemenu />
            <h1 className="notification-title">Upcoming Lectures</h1>

            {loading && <p className="loading-message">Loading...</p>}

            {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && (
                <ul className="upcoming-lectures-list">
                    {upcomingLectures.map((lecture) => (
                        <li key={lecture.key} className="lecture-item">
                            <div className="lecture-info">
                                <p><strong>Date:</strong> {lecture.date}</p>
                                <p><strong>Starting Time:</strong> {lecture.startingTime}</p>
                            </div>
                            <div className="lecture-details">
                                <p><strong>Subject ID:</strong> {lecture.subjectId}</p>
                                <p><strong>Venue:</strong> {lecture.venue}</p>
                            </div>
                            {/* Add other lecture details as needed */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notification;
