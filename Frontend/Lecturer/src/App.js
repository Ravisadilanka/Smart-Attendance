import './App.css';
import { BrowserRouter as Router,Route, Routes } from 'react-router-dom';
import View_attendance from './Components/View_attendance/View_attendance';
import SignUp from './Components/SignUp/SignUp';
import Header from './Components/Header/Header';
import SideMenu from './Components/SideMenu/Sidemenu'
import Dashboard from './Components/Dashboard/Dashboard';

function App() {
  return (
    <div className="App">
      <Router>
      <div className="App">
        <Header/>
        <SideMenu/>
        <Routes>
        <Route exact path='/' element={<SignUp/>}/>
        <Route path='/View_attendance' element={<View_attendance/>}/>
        <Route path='/Dashboard' element={<Dashboard/>}/>
        </Routes>
      </div>
    </Router>
    </div>
  );
}

export default App;
