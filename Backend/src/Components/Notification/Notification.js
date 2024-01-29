import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../../firebase';
import Sidemenu from '../SideMenu/Sidemenu';

const Notification = () => {
    const [upcomingLectures, setUpcomingLectures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUpcomingLectures = async () => {
            try {
                const currentTime = new Date();
                const halfAnHourLater = new Date(currentTime.getTime() + 30 * 60 * 1000);

                const lecturesRef = ref(db, 'lectures'); // use ref here
                const snapshot = await get(lecturesRef); // use get here

                const upcomingLecturesData = [];
                snapshot.forEach((childSnapshot) => {
                    const lectureData = childSnapshot.val();
                    const lectureKey = childSnapshot.key;

                    // Check if the lecture starts within the next 30 minutes
                    const lectureStartTime = new Date(`${lectureData.date}T${lectureData.startingTime}`);
                    if (lectureStartTime > currentTime && lectureStartTime <= halfAnHourLater) {
                        upcomingLecturesData.push({ ...lectureData, key: lectureKey });
                    }
                });

                setUpcomingLectures(upcomingLecturesData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching upcoming lectures:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchUpcomingLectures();
    }, []);

    return (
        <div>
            <Sidemenu />
            <h1>Upcoming Lectures</h1>

            {loading && <p>Loading...</p>}

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {!loading && !error && (
                <ul>
                    {upcomingLectures.map((lecture) => (
                        <li key={lecture.key}>
                            <p>Date: {lecture.date}</p>
                            <p>Starting Time: {lecture.startingTime}</p>
                            <p>Subject ID: {lecture.subjectId}</p>
                            <p>Venue: {lecture.venue}</p>
                            {/* Add other lecture details as needed */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notification;
