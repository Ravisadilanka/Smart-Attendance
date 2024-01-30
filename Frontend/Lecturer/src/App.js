import './App.css';
import { BrowserRouter as Router,Route, Routes } from 'react-router-dom';
import View_attendance from './Components/View_attendance/View_attendance';
import SignUp from './Components/SignUp/SignUp';
import Header from './Components/Header/Header';
import SideMenu from './Components/SideMenu/Sidemenu'
import Dashboard from './Components/Dashboard/Dashboard';
import Forget_Password from './Components/Forget_Password/Forget_Password';
import Add_Subject from './Components/Add_Subject/Add_Subject';


function App() {
  return (
    <div className="App">
      <Router>
      <div className="App">
        <Header/>
        <SideMenu/>
        <Routes>
        <Route exact path='/' element={<Forget_Password/>}/>
        <Route path='/Forget_Password' element={<Forget_Password/>}/>
        <Route path='/SignUp' element={<SignUp/>}/>
        <Route path='/View_attendance' element={<View_attendance/>}/>
        <Route path='/Dashboard' element={<Dashboard/>}/>
        <Route path='/Add_Subject' element={<Add_Subject/>}/>
        </Routes>
      </div>
    </Router>
    </div>
  );
}

export default App;
