// App.js
import Header from '../components/Header'
import Sidebar from '../components/Sidebar';
import React, { useState } from 'react';
import img1 from '../images/profile.jpg'
import '../../src/Test.css'

const App = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [index, setIndex] = useState('');
  const [idnum, setIDnum] = useState('');
  const [telnum, setTelnum] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const enableEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className='user-prof'>

    <Header/>
    <Sidebar/>
      <h1>User Profile</h1>

      <img src={img1} height={100} width={100}  />
      <form className='test' id='form'>
        {/* <label htmlFor="name">Name:</label> */}
        <input
          type="text"
          id="name"
          placeholder='Name'
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          readOnly={!isEditing}
        />

        {/* <label htmlFor="email">Email:</label> */}
        <input
          type="email"
          id="email"
          placeholder='Email'
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          readOnly={!isEditing}
        />

{/* <label htmlFor="index">Email:</label> */}
        <input
          type="text"
          id="index"
          placeholder='Index Number'
          name="index"
          value={index}
          onChange={(e) => setIndex(e.target.value)}
          readOnly={!isEditing}
        />

        <input
          type="text"
          id="id"
          placeholder='ID Number'
          name="idnum"
          value={idnum}
          onChange={(e) => setIDnum(e.target.value)}
          readOnly={!isEditing}
        />
 
        <input
          type="text"
          id="telnum"
          placeholder='Mobile Number'
          name="telnum"
          value={telnum}
          onChange={(e) => setTelnum(e.target.value)}
          readOnly={!isEditing}
        />


        

        <button type="button" className='userprof-btn' onClick={enableEdit}>
          Edit
        </button>
      </form>
    </div>
  );
};

export default App;
