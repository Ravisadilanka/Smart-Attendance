import './App.css';
import { BrowserRouter as Router,Route, Routes } from 'react-router-dom';
import View_attendance from './Components/View_attendance/View_attendance';
import SignUp from './Components/SignUp/SignUp';
import Header from './Components/Header/Header';
import SideMenu from './Components/SideMenu/Sidemenu'
import Dashboard from './Components/Dashboard/Dashboard';
import Forget_Password from './Components/Forget_Password/Forget_Password';
import Add_Subject from './Components/Add_Subject/Add_Subject';
import Add_Lecture from './Components/Add_Lecture/Add_Lecture';
import Notification1 from './Components/Notifications/Notifications';
import Notifications2 from './Components/Notifications/Notifications2';
import Login from './Components/Login/Login';


function App() {
  return (
    <div className="App">
      <Router>
      <div className="App">
        <Header/>
        <Routes>
        <Route exact path='/' element={<Login/>}/>
        <Route path='/Forget_Password' element={<Forget_Password/>}/>
        <Route path='/SignUp' element={<SignUp/>}/>
        <Route path='/View_attendance' element={<View_attendance/>}/>
        <Route path='/Dashboard' element={<Dashboard/>}/>
        <Route path='/Add_Subject' element={<Add_Subject/>}/>
        <Route path='/Add_Lecture' element={<Add_Lecture/>}/>
        <Route path='/Notification1' element={<Notification1/>}/>
        <Route path='/Notifications2' element={<Notifications2/>}/>
        </Routes>
      </div>
    </Router>
    </div>
  );
}

export default App;
