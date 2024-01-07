import './App.css';
import Add_Lecture from './Components/Add_Lecture';
import Header from './Components/Header';
import Signup from './Components/Signup';
import Add_Subject from './Components/Add_Subject';
import { BrowserRouter as Router,Route, Routes } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import Select_a_Subject from './Components/Select_a_Subject';
import Attendance from './Components/Attendance';
import Footer from './Components/Footer';
import Dashboard_New_User from './Components/Dashboard_New_User';
import Login from './Components/Login';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Footer />
        <Routes>
          <Route exact path='/' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/Add_Lecture' element={<Add_Lecture />} />
          <Route path='/Add_Subject' element={<Add_Subject />} />
          <Route path='/Dashboard' element={<Dashboard />} />
          <Route path='/Select_a_Subject' element={<Select_a_Subject />} />
          <Route path='/Attendance' element={<Attendance />} />
          <Route path='/Dashboard_New_User' element={<Dashboard_New_User />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;


