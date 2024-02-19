import React, { useState, useEffect } from 'react';
import { VscCheck, VscClose } from 'react-icons/vsc';
import { auth, db } from '../../firebase'; // Import the db instance
import { ref, onValue, get, set, push } from 'firebase/database';
import { useParams } from 'react-router-dom'; // Import useParams from react-router-dom
import { CSVLink } from 'react-csv';
import Sidemenu from '../SideMenu/Sidemenu';
import './StudentAttendance.css';

const StudentAttendance = ({ lectureStartingTime, lectureEndingTime }) => {
    const [studentsData, setStudentsData] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const { lectureNumber, subjectID } = useParams();
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
                            console.log(relevantStudents)
                            setStudentsData(relevantStudents);
                        } else {
                            console.log('Current user not found in students data.');
                        }
                    } else {
                        console.log('No students data available.');
                    }
                })

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
                                console.log('Starting Time55:', lectureData.startingTime);
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
                            console.log('test1');
                            console.log(specificAttendanceData.subjectID);

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
    }, [lectureNumber, subjectID, studentsData]);

    const csvData = studentsData.map(student => ({
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
            const newAttendanceKey = push(attendanceRef).key;

            const attendanceDataToSave = {
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
                        student.Last_attendance_time.split(' ')[1]?.substring(0, 5) > startingTime &&
                            student.Last_attendance_time.split(' ')[1]?.substring(0, 5) < endingTime &&
                            student.Last_attendance_time.split(' ')[0] === date
                            ? 'Present'
                            : 'Absent',
                })),
            };

            await set(ref(db, `attendance/${newAttendanceKey}`), attendanceDataToSave);

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
    }, [date, endingTime, lectureNumber, subjectID]);

    const currentDateAttendance = new Date();
    console.log("time")
    console.log(currentDateAttendance)
    const lectureAttendanceEndTime = new Date(`${date}T${endingTime}`);
    console.log(lectureAttendanceEndTime)

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
                                <td>{student.Last_attendance_time || 'N/A'}</td>
                                <td>
                                    {student.Last_attendance_time &&
                                    student.Last_attendance_time.split(' ')[1]?.substring(0, 5) > startingTime &&
                                    student.Last_attendance_time.split(' ')[1]?.substring(0, 5) < endingTime &&
                                    student.Last_attendance_time.split(' ')[0] === date ? (
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
                                    {student.Last_Attendance_time.split(' ')[1]?.substring(0, 5) > startingTime &&
                                        student.Last_Attendance_time.split(' ')[1]?.substring(0, 5) < endingTime &&
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

export default StudentAttendance;
