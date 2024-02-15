import React, { useState, useEffect } from 'react';
import { VscCheck, VscClose } from 'react-icons/vsc';
import { db } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import { useParams } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import Sidemenu from '../SideMenu/Sidemenu';
import './View_attendance.css';

const Attendance = ({ lectureStartingTime, lectureEndingTime }) => {
    const [studentsData, setStudentsData] = useState([]);
    const { lectureNumber, subjectID } = useParams();
    const [startingTime, setStartingTime] = useState(null);
    const [endingTime, setEndingTime] = useState(null);
    const [date, setDate] = useState(null);
    const [desiredYear, setDesiredYear] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch relevant year based on subjectId
                const subjectsRef = ref(db, 'subjects');
                onValue(subjectsRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const subjectsData = snapshot.val();
                        const subjectDetails = Object.values(subjectsData)?.find(subject => subject.subjectID === subjectID);
    
                        if (subjectDetails) {
                            setDesiredYear(subjectDetails.Year);
                        } else {
                            console.log(`Subject ${subjectID} not found.`);
                        }
                    } else {
                        console.log('No subjects data available.');
                    }
                });

                // Fetch students data
                const studentsRef = ref(db, 'Students');
                onValue(studentsRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const studentsDataArray = Object.entries(snapshot.val()).map(([id, details]) => ({
                            id,
                            ...details,
                        }));

                        // Filter students based on AcademicYear
                        const filteredStudents = studentsDataArray.filter(student => student.AcademicYear.split('/')[0] === desiredYear);

                        setStudentsData(filteredStudents);
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
                            setDate(specificLectureData.date);
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
    }, [lectureNumber, subjectID, desiredYear]);

    const csvData = studentsData.map(student => ({
        Name: student.name,
        'Registration Number': student.id,
        'Last Attendance Time': student.Last_attendance_time,
        'Attendance Status': student.Last_attendance_time.split(' ')[1].substring(0, 5) > startingTime &&
            student.Last_attendance_time.split(' ')[1].substring(0, 5) < endingTime &&
            student.Last_attendance_time.split(' ')[0] === date ? 'Present' : 'Absent',
    }));

    const csvHeaders = [
        { label: 'Name', key: 'Name' },
        { label: 'Registration Number', key: 'Registration Number' },
        { label: 'Last Attendance Time', key: 'Last Attendance Time' },
        { label: 'Attendance Status', key: 'Attendance Status' },
    ];

    return (
        <div className='table-wrapper'>
            <Sidemenu />
            <div className="centered-div">
                <CSVLink data={csvData} headers={csvHeaders} filename={`Attendance_Lecture_${lectureNumber}.csv`}>
                    Download CSV
                </CSVLink>
            </div>
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
                                {student.Last_attendance_time.split(' ')[1].substring(0, 5) > startingTime && student.Last_attendance_time.split(' ')[1].substring(0, 5) < endingTime && student.Last_attendance_time.split(' ')[0] === date ? (
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
