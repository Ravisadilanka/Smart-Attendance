import React, { useState, useEffect } from 'react';
import { VscCheck, VscClose } from 'react-icons/vsc';
import { auth, db } from '../../firebase'; // Import the db instance
import { ref, onValue } from 'firebase/database';
import { useParams } from 'react-router-dom'; // Import useParams from react-router-dom
import { CSVLink } from 'react-csv';
import Sidemenu from '../SideMenu/Sidemenu';
import './StudentAttendance.css';

const StudentAttendance = ({ lectureStartingTime, lectureEndingTime }) => {
    const [studentsData, setStudentsData] = useState([]);
    const { lectureNumber } = useParams();
    const [startingTime, setStartingTime] = useState(null);
    const [endingTime, setEndingTime] = useState(null);
    const [date, setDate] = useState(null);
    const [academicYear, setAcademicYear] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = auth.currentUser;

                // Fetch students data
                const studentsRef = ref(db, 'Students');
                onValue(studentsRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const studentsDataArray = Object.entries(snapshot.val()).map(([id, details]) => ({
                            id,
                            ...details,
                        }));
                        
                        // Find the student with the current user's email
                        const currentUserStudent = studentsDataArray.find(student => student.email === user.email);
                        
                        if (currentUserStudent) {
                            // Set the AcademicYear from the current user's student data
                            setAcademicYear(currentUserStudent.AcademicYear);
                            console.log(academicYear.split('/')[0]);
                            
                            // Filter students based on the AcademicYear
                            const relevantStudents = studentsDataArray.filter(student => student.AcademicYear === academicYear);
                            setStudentsData(relevantStudents);
                        } else {
                            console.log('Current user not found in students data.');
                        }
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
    }, [lectureNumber, academicYear]);  // Added user to the dependency array

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
                                {student.Last_attendance_time.split(' ')[1].substring(0, 5) > startingTime &&
                                    student.Last_attendance_time.split(' ')[1].substring(0, 5) < endingTime &&
                                    student.Last_attendance_time.split(' ')[0] === date ? (
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

export default StudentAttendance;
