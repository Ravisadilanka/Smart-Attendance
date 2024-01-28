import React, { useState, useEffect } from 'react';
import { VscCheck, VscClose } from 'react-icons/vsc';
import { db } from '../firebase'; // Import the db instance
import { ref, onValue } from 'firebase/database';
import { useParams } from 'react-router-dom'; // Import useParams from react-router-dom

const Attendance = ({ lectureStartingTime, lectureEndingTime }) => {
    const [studentsData, setStudentsData] = useState([]);
    const [lecturesData, setLecturesData] = useState([]);
    const { lectureNumber } = useParams(); // Get the lecture number from the URL
    const [startingTime, setStartingTime] = useState(null);
    const [endingTime, setEndingTime] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch students data
                const studentsRef = ref(db, 'Students');
                onValue(studentsRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const studentsDataArray = Object.entries(snapshot.val()).map(([id, details]) => ({
                            id,
                            ...details,
                        }));
                        setStudentsData(studentsDataArray);
                    } else {
                        console.log('No students data available.');
                    }
                });

                // Fetch specific lecture data
                const specificLectureRef = ref(db, 'lectures');
                onValue(specificLectureRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const allLecturesData = snapshot.val();
                        const specificLectureKey = Object.keys(allLecturesData).find(
                            key => allLecturesData[key].lectureNumber === lectureNumber
                        );
    
                        if (specificLectureKey) {
                            const specificLectureData = allLecturesData[specificLectureKey];
                            console.log('Starting Time:', specificLectureData.startingTime);
                            console.log('Ending Time:', specificLectureData.endingTime);
                            setStartingTime(specificLectureData.startingTime);
                            setEndingTime(specificLectureData.endingTime);
                        } else {
                            console.log(`Lecture ${lectureNumber} not found.`);
                        }
                    } else {
                        console.log('No lectures data available.');
                    }
                });

            } catch (error) {
                console.error('Error fetching data from Firebase:', error.message);
            }
        };

        fetchData();
    }, [lectureNumber]);



    return (
        <div className='table-wrapper'>
            <table className='table'>
                <thead className='expand'>
                    <tr>
                        <th>Name</th>
                        <th>Registration Number</th>
                        <th>Last Attendance Time</th>
                        <th>Attendance Status</th>
                    </tr>
                </thead>
                <tbody>
                    {studentsData.map((student) => (
                        <tr key={student.id}>
                            <td>{student.name}</td>
                            <td>{student.id}</td>
                            <td>{student.Last_attendance_time}</td>
                            <td>
                                {student.Last_attendance_time.split(' ')[1].substring(0, 5) > startingTime && student.Last_attendance_time.split(' ')[1].substring(0, 5) < endingTime ? (
                                    <VscCheck color="green" />
                                ) : (
                                    <VscClose color="red" />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Attendance;
