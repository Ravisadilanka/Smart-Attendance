
import { BrowserRouter, Routes , Route} from 'react-router-dom'
// import { useForm } from 'react-hook-form';
import ForgetPw from './pages/ForgetPw'
import EditProfile from './pages/EditProfile'
import DeleteMembers from './pages/DeleteMembers'
import AcademicYears from './pages/AcademicYears'
import Subjects from './pages/Subjects'
import StudentAttendence from './pages/StudentAttendence'
import UserProfile from './pages/UserProfile'
import EditStaff from './pages/EditStaff'
import EditStudent from './pages/EditStudent'
import SignUp from './pages/SignUp'
import Test from './pages/Test'
import Login from './pages/Login'


import Home from './pages/Home'
import './App.css';
import SelectSubject from './pages/SelectSubject'

import Footer from './components/Footer'
import Dashboard from './pages/DashBoard'


  function App() {
    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route index element = {<Home />} />
            <Route path="/ForgetPw" element={<ForgetPw />} />
            <Route path="/EditProfile" element={<EditProfile />} />
            <Route path="/DeleteMembers" element={<DeleteMembers />} /> 
            <Route path="/AcademicYears" element={<AcademicYears />} /> 
            <Route path="/Subjects" element={<Subjects />} /> 
            <Route path="/SelectSubject" element={<SelectSubject />} /> 
            <Route path="/StudentAttendence" element={<StudentAttendence />} />
            <Route path="/UserProfile" element={<UserProfile />} />
            <Route path="/EditStaff" element={<EditStaff />} />
            <Route path="/EditStudent" element={<EditStudent />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/test" element={<Test />} />
            <Route path="/DashBoard" element={<Dashboard />} />
            <Route path="/Login" element={<Login />} />

            <Route path="/Home" element={<Home />} />

          </Routes>
        
        </BrowserRouter>

        { <Footer/> }
        
        
      </div>
    );
  }

export default App;
