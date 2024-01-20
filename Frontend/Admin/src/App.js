
import { BrowserRouter, Routes , Route} from 'react-router-dom'
import ForgetPw from './pages/ForgetPw'
import EditProfile from './pages/EditProfile'
import DeleteMembers from './pages/DeleteMembers'
import AcademicYears from './pages/AcademicYears'
import Subjects from './pages/Subjects'
import StudentAttendence from './pages/StudentAttendence'

import Home from './pages/Home'
import './App.css';
import SelectSubject from './pages/SelectSubject'

import Footer from './components/Footer'


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

            <Route path="/Home" element={<Home />} />

          </Routes>
        
        </BrowserRouter>

        { <Footer/> }
        
        
      </div>
    );
  }

export default App;
