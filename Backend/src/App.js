import './App.css';
import AddLecture from './Components/Add_Lecture';
import Header from './Components/Header/Header';
import Signup from './Components/SignUp/SignUp';
import AddSubject from './Components/Add_Subject';
import { BrowserRouter as Router,Route, Routes } from 'react-router-dom';
import Dashboard from './Components/Dashboard/Dashboard';
import SelectSubject from './Components/Select_a_Subject';
import Attendance from './Components/View_attendance/View_attendance';
import Footer from './Components/Footer';
import DashboardNewUser from './Components/Dashboard_New_User';
import Login from './Components/Login/Login';
import ForgotPassword from './Components/Forget_Password/Forget_Password';
import Notification from './Components/Notification/Notification';
import UserProfile from './Components/Profile/UserProfile';
// import ResetPassword from './Components/Reset_Password/ResetPassword';

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
          <Route path={`/Attendance/:lectureNumber`} element={<Attendance />} />
          <Route path='/Dashboard_New_User' element={<DashboardNewUser />} />
          <Route path='/forgot_password' element={<ForgotPassword />} />
          <Route path='/notifications' element={<Notification />} />
          <Route path='/Profile' element={<UserProfile />} />
          {/* <Route path='/reset_password/:oobCode' element={<ResetPassword />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;


