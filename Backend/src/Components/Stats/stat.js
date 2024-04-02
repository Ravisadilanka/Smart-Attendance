import { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { ref, get } from 'firebase/database';
import { useNavigate, useParams } from 'react-router-dom';
import Sidemenu from '../SideMenu/Sidemenu';

export default function Analytics() {
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();
  const { subjectID } = useParams();
  const [currentStudentData, setCurrentStudentData] = useState(null);
  const [studentsAttendance, setStudentsAttendance] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log('Subject ID from URL:', subjectID);
      try {
        const user = auth.currentUser;

        if (!user) {
          console.log('User is not logged in.');
          navigate('/');
          return;
        }

        const userEmail = user.email;
        console.log('Current user email:', userEmail);

        const studentsRef = ref(db, 'Students');
        const studentsSnapshot = await get(studentsRef);

        if (studentsSnapshot.exists()) {
          let studentsAttendanceData = [];
          studentsSnapshot.forEach((studentSnapshot) => {
            const studentData = studentSnapshot.val();
            setCurrentStudentData(studentData);

            // Fetch attendance data once student data is found
            fetchAttendanceData(studentData.id, subjectID, studentData.name, studentSnapshot.key)
              .then(attendance => {
                if (attendance) {
                  studentsAttendanceData.push(attendance);
                  setStudentsAttendance([...studentsAttendanceData]);
                }
              });
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [subjectID]);

  const fetchAttendanceData = async (studentId, subjectId, studentName, studentKey) => {
    try {
      const attendanceRef = ref(db, 'attendance');
      const attendanceSnapshot = await get(attendanceRef);

      if (attendanceSnapshot.exists()) {
        let presentCount = 0;
        let absentCount = 0;
        let foundAttendance = false;

        attendanceSnapshot.forEach((attendanceSnapshot) => {
          const attendanceRecord = attendanceSnapshot.val();

          if (attendanceRecord.subjectID === subjectId) {
            foundAttendance = true;

            attendanceRecord.students.forEach(student => {
              if (student.id === studentId) {
                if (student.attendanceStatus === "Present") {
                  presentCount++;
                } else if (student.attendanceStatus === "Absent") {
                  absentCount++;
                }
              }
            });
          }
        });

        if (foundAttendance && (presentCount > 0 || absentCount > 0)) {
          const totalLectures = presentCount + absentCount;
          const attendancePercentage = totalLectures > 0 ? (presentCount / totalLectures) * 100 : 0;

          return {
            id: studentKey,
            name: studentName,
            present: presentCount,
            absent: absentCount,
            percentage: attendancePercentage.toFixed(2)
          };
        }
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  return (
    <div>
      <Sidemenu />
      <div>
        <h2>Students Attendance</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {studentsAttendance.map((student, index) => (
              <tr key={index}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.present}</td>
                <td>{student.absent}</td>
                <td>{student.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
