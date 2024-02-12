import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../../firebase';
import Sidemenu from '../SideMenu/Sidemenu';
import './Notification.css';

const Notification = () => {
    const [allLectures, setAllLectures] = useState([]);
    const [visibleLectures, setVisibleLectures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const lecturesPerPage = 3;

    const handleNextPage = () => {
        if (currentPage < Math.ceil(allLectures.length / lecturesPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    useEffect(() => {
        const fetchAllLectures = async () => {
            try {
                const currentTime = new Date();
                const oneWeekAgo = new Date(currentTime.getTime() - 7 * 24 * 60 * 60 * 1000);

                const lecturesRef = ref(db, 'lectures');
                const snapshot = await get(lecturesRef);

                const allLecturesData = [];
                snapshot.forEach((lectureSnapshot) => {
                    const lectureData = lectureSnapshot.val();
                    const lectureKey = lectureSnapshot.key;

                    const lectureStartTime = new Date(`${lectureData.date}T${lectureData.startingTime}`);
                    if (lectureStartTime < currentTime && lectureStartTime >= oneWeekAgo) {
                        allLecturesData.push({ ...lectureData, key: lectureKey });
                    }
                });

                setAllLectures(allLecturesData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching all lectures:', error);
                setError('Failed to fetch lectures. Please try again later.');
                setLoading(false);
            }
        };

        fetchAllLectures();

        const intervalId = setInterval(fetchAllLectures, 5 * 60 * 1000); // Fetch every 5 minutes

        return () => clearInterval(intervalId); // Clear interval on component unmount
    }, []);

    useEffect(() => {
        const sortedLectures = allLectures.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.startingTime}`);
            const dateB = new Date(`${b.date}T${b.startingTime}`);
            return dateB - dateA;
        });

        const indexOfLastLecture = currentPage * lecturesPerPage;
        const indexOfFirstLecture = indexOfLastLecture - lecturesPerPage;
        const currentVisibleLectures = sortedLectures.slice(indexOfFirstLecture, indexOfLastLecture);

        setVisibleLectures(currentVisibleLectures);
    }, [allLectures, currentPage]);

    return (
        <div className="notification-container">
            <Sidemenu />
            <h1 className="notification-title">Notifications</h1>

            {loading && <p className="loading-message">Loading...</p>}

            {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && (
                <div>
                    <ul className="previous-lectures-list">
                        {visibleLectures.map((lecture) => (
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

                    <div className="pagination">
                        {currentPage > 1 && (
                            <button onClick={handlePrevPage} className="prev-button">
                                Previous
                            </button>
                        )}

                        {currentPage < Math.ceil(allLectures.length / lecturesPerPage) && (
                            <button onClick={handleNextPage} className="next-button">
                                See More
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notification;
