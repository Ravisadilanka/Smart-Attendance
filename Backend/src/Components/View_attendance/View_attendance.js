import React, { useState, useEffect } from 'react';
import { VscCheck, VscClose } from 'react-icons/vsc';
import { db } from '../../firebase';
import { ref, onValue, push, set, get, off } from 'firebase/database';
import { useParams } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import Sidemenu from '../SideMenu/Sidemenu';
import './View_attendance.css';

const Attendance = ({ lectureStartingTime, lectureEndingTime }) => {
    const [studentsData, setStudentsData] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
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
                        const subjectDetails = Object.values(subjectsData)?.find(
                            (subject) => subject.subjectID === subjectID
                        );

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
                        const filteredStudents = studentsDataArray.filter(
                            (student) => student.AcademicYear.split('/')[0] === desiredYear
                        );

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
                        let lectureFound = false;

                        // Iterate through each lecture in the database
                        Object.keys(allLecturesData).forEach((key) => {
                            const lectureData = allLecturesData[key];

                            // Check if lectureNumber and subjectID match
                            if (lectureData.lectureNumber === lectureNumber && lectureData.subjectId === subjectID) {
                                console.log('Starting Time:', lectureData.startingTime);
                                console.log('Ending Time:', lectureData.endingTime);
                                console.log('Date:', lectureData.date);
                                setStartingTime(lectureData.startingTime);
                                setEndingTime(lectureData.endingTime);
                                setDate(lectureData.date);

                                // If you found a match, set the flag to true
                                lectureFound = true;
                            }
                        });

                        // If no match is found, print an error message
                        if (!lectureFound) {
                            console.log(`Lecture with lectureNumber ${lectureNumber} and subjectID ${subjectID} not found.`);
                        }
                    } else {
                        console.log('No lectures data available.');
                    }
                });
                // Fetch specific attendance data
                const specificAttendanceRef = ref(db, 'attendance');
                onValue(specificAttendanceRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const allAttendanceData = snapshot.val();
                        const specificAttendanceKey = Object.keys(allAttendanceData).find(
                            (key) =>
                                allAttendanceData[key].lectureNumber === lectureNumber &&
                                allAttendanceData[key].subjectID === subjectID
                        );

                        if (specificAttendanceKey) {
                            const specificAttendanceData = allAttendanceData[specificAttendanceKey];
                            console.log('test');
                            console.log(specificAttendanceData.students);

                            setAttendanceData(specificAttendanceData);
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

    const currentDate = new Date();

    const csvData = studentsData.map((student) => ({
        Name: student.name,
        'Registration Number': student.id,
        'Last Attendance Time': student.Last_attendance_time,
        'Attendance Status': student.Last_attendance_time?.split(' ')[1]?.substring(0, 5) > startingTime &&
            student.Last_attendance_time?.split(' ')[1]?.substring(0, 5) < endingTime &&
            student.Last_attendance_time?.split(' ')[0] === date ? 'Present' : 'Absent',
    }));

    const csvHeaders = [
        { label: 'Name', key: 'Name' },
        { label: 'Registration Number', key: 'Registration Number' },
        { label: 'Last Attendance Time', key: 'Last Attendance Time' },
        { label: 'Attendance Status', key: 'Attendance Status' },
    ];

    const saveAttendanceToDatabase = async () => {
        try {
            const attendanceRef = ref(db, 'attendance');

            // Generate a unique key for the attendance data
            const newAttendanceKey = push(attendanceRef).key;

            // Save attendance data to the database
            await set(ref(db, `attendance/${newAttendanceKey}`), {
                lectureNumber,
                subjectID,
                date,
                startingTime,
                endingTime,
                students: studentsData.map((student) => ({
                    id: student.id,
                    name: student.name,
                    Last_Attendance_time: student.Last_attendance_time,
                    attendanceStatus:
                        student.Last_attendance_time.split(' ')[1].substring(0, 5) > startingTime &&
                            student.Last_attendance_time.split(' ')[1].substring(0, 5) < endingTime &&
                            student.Last_attendance_time.split(' ')[0] === date
                            ? 'Present'
                            : 'Absent',
                })),
            });

            console.log('Attendance data saved successfully!');
        } catch (error) {
            console.error('Error saving attendance data to Firebase:', error.message);
        }
    };

    const lectureEndTime = new Date(`${date}T${endingTime}`);
    console.log('lecture end time');

    console.log(lectureEndTime);

    useEffect(() => {
        const checkAndSaveAttendance = async () => {
            try {
                const attendanceRef = ref(db, 'attendance');

                // Fetch all existing attendance data
                const existingAttendanceSnapshot = await get(attendanceRef);

                if (existingAttendanceSnapshot.exists()) {
                    const allAttendanceData = existingAttendanceSnapshot.val();

                    // Iterate through existing entries
                    for (const attendanceKey in allAttendanceData) {
                        const existingAttendance = allAttendanceData[attendanceKey];

                        // Check for conflicts or duplicates
                        if (
                            existingAttendance.subjectID === subjectID &&
                            existingAttendance.date === date &&
                            existingAttendance.lectureNumber === lectureNumber
                        ) {
                            console.log('Attendance data already exists for this subject, date, and lectureNumber.');
                            return; // Exit function if there's a conflict
                        }
                    }
                }

                const currentDate = new Date();
                const lectureEndTime = new Date(`${date}T${endingTime}`);

                if (currentDate >= lectureEndTime) {
                    saveAttendanceToDatabase();
                }
            } catch (error) {
                console.error('Error checking attendance data in Firebase:', error.message);
            }
        };

        const intervalId = setInterval(checkAndSaveAttendance, 1000); // Check every second

        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, [date, endingTime, lectureNumber, subjectID, studentsData]);

    const currentDateAttendance = new Date();
    const lectureAttendanceEndTime = new Date(`${date}T${endingTime}`);

    return (
        <div className='table-wrapper'>
            <Sidemenu />
            <div className='centered-div'>
                <CSVLink data={csvData} headers={csvHeaders} filename={`Attendance_Lecture_${lectureNumber}.csv`}>
                    Download CSV
                </CSVLink>
            </div>
            <div>{currentDateAttendance < lectureAttendanceEndTime ? <p>Ongoing Lecture</p> : <p>Closed Lecture</p>}</div>
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
                    {currentDateAttendance < lectureAttendanceEndTime ? (
                        studentsData.map((student) => (
                            <tr key={student.id}>
                                <td>{student.name}</td>
                                <td>{student.id}</td>
                                <td>{student.Last_attendance_time}</td>
                                <td>
                                    {student.Last_attendance_time?.split(' ')[1]?.substring(0, 5) > startingTime &&
                                        student.Last_attendance_time?.split(' ')[1]?.substring(0, 5) < endingTime &&
                                        student.Last_attendance_time?.split(' ')[0] === date ? (
                                        <VscCheck color='green' />
                                    ) : (
                                        <VscClose color='red' />
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : attendanceData.students ? (
                        attendanceData.students.map((student, index) => (
                            <tr key={student.id}>
                                <td>{student.name}</td>
                                <td>{student.id}</td>
                                <td>{student.Last_Attendance_time}</td>
                                <td>
                                    {student.Last_Attendance_time.split(' ')[1].substring(0, 5) > startingTime &&
                                        student.Last_Attendance_time.split(' ')[1].substring(0, 5) < endingTime &&
                                        student.Last_Attendance_time.split(' ')[0] === date ? (
                                        <VscCheck color='green' />
                                    ) : (
                                        <VscClose color='red' />
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan='4'>No attendance data available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Attendance;
