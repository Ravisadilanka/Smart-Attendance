import { BrowserRouter as Router,Route, Routes } from 'react-router-dom';
import Form from './components/Form';
import Notification02 from './components/Notification02';
import Header from './components/Header';
import Notification03 from './components/Notification03';
import './App.css';
import Notification01 from './components/Notification01';
import Dashboard from './components/Dashboard';
import Notification04 from './components/Notification04';
import Sidemenu from './components/Sidemenu';
import Signup from './components/Signup';
import Notification05 from './components/Notification05';
import Forgetpassword from './components/Forgetpassword';
import Notification06 from './components/Notification06';
import Footer from './components/Footer';
import Selectsubject from './components/Selectsubject';
import Selectlesson from './components/Selectlesson';

function App() {
  return (
    <Router>
      <div className="App">
        <Header/>
        <Footer/>
        <Routes>
        <Route exact path='/' element={<Form/>}/>
        <Route path='/Forgetpassword' element={<Forgetpassword/>}/>
        <Route path='/Dashboard' element={<Dashboard/>}/>
        <Route path='/Selectsubject' element={<Selectsubject/>}/>
        <Route path='/Signup' element={<Signup/>}/>
        <Route path='/Notification01' element={<Notification01/>}/>
          <Route path='/Notification02' element={<Notification02/>}/>
          <Route path='/Notification03' element={<Notification03/>}/>
          <Route path='/Notification04' element={<Notification04/>}/>
          <Route path='/Notification05' element={<Notification05/>}/>
          <Route path='/Notification06' element={<Notification06/>}/>
          <Route path='/Selectlesson' element={<Selectlesson/>}/>
          
        </Routes>
      </div>
    </Router>
  );
};

export default App;