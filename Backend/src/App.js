import './App.css';
import AddLecture from './Components/Add_Lecture/Add_Lecture';
import Header from './Components/Header/Header';
import Signup from './Components/SignUp/SignUp';
import AddSubject from './Components/Add_Subject';
import { BrowserRouter as Router,Route, Routes } from 'react-router-dom';
import Dashboard from './Components/Dashboard/Dashboard';
import SelectSubject from './Components/Select_a_Subject/Select_a_Subject';
import Attendance from './Components/View_attendance/View_attendance';
import Footer from './Components/Footer';
import DashboardNewUser from './Components/Dashboard_New_User';
import Login from './Components/Login/Login';
import ForgotPassword from './Components/Forget_Password/Forget_Password';
import Notification from './Components/Notification/Notification';
import UserProfile from './Components/Profile/UserProfile';
import ResetPassword from './Components/ResetPassword/ResetPassword';
import AdminDashboard from './Components/Admin_Dashboard/DashBoard';
import ViewStaff from './Components/ViewStaff/ViewStaff';
import AccademicYears from './Components/AccedemicYears/AcademicYears';
import ViewStudents from './Components/ViewStudents/ViewStudents';
import StudentDashboard from './Components/Student_Dashboard/StudentDashboard';
import ViewSubject from './Components/ViewSubject/ViewSubject';
import StudentAttendance from './Components/StudentAttendance/StudentAttendance';
import Analytics from './Components/Analytics/Analytics';
import Stat from './Components/Stats/stat';
import StudentAnalytics from './Components/StudentAnalytics/StudentAnalytics';


function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Footer />
        <Routes>
          <Route exact path='/' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path={`/Add_Lecture/:subjectID`} element={<AddLecture />} />
          <Route path='/Add_Subject' element={<AddSubject />} />
          <Route path='/Dashboard' element={<Dashboard />} />
          <Route path={`/Select_a_Subject/:subjectID`} element={<SelectSubject />} />
          <Route path={`/ViewSubject/:subjectID`} element={<ViewSubject />} />
          <Route path={`/Attendance/:subjectID/lecture/:lectureNumber`} element={<Attendance />} />
          <Route path={`/StudentAttendance/:subjectID/lecture/:lectureNumber`} element={<StudentAttendance />} />
          <Route path='/Dashboard_New_User' element={<DashboardNewUser />} />
          <Route path='/forgot_password' element={<ForgotPassword />} />
          <Route path='/notifications' element={<Notification />} />
          <Route path='/Profile' element={<UserProfile />} />
          <Route path="/reset_password/:oobCode?" element={<ResetPassword />} />
          <Route path="/admin_dashboard" element={<AdminDashboard />} />
          <Route path="/view_staffdetails" element={<ViewStaff />} />
          <Route path="/academic_years" element={<AccademicYears />} />
          <Route path="/academic_years/:academicYear" element={<ViewStudents />} />
          <Route path="/student_dashboard" element={<StudentDashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/studentanalytics" element={<StudentAnalytics />} />
          <Route path={`/analytics/:subjectID`} element={<Stat />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;


