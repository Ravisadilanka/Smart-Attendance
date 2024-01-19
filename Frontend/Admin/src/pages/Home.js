import React from 'react'
import Header from '../components/Header'
import {Outlet, Link}  from "react-router-dom";

export default function() {
  return (

    <div>
      <Header/>
      <Sidebar/>
      <Footer/>   
      <h1>Home Page</h1>
      <Link to = "/ForgetPw"> Forget Password </Link><br></br>
      <Link to = "/EditProfile"> Edit Profile </Link><br></br>
      <Link to = "/DeleteMembers"> Delete Members </Link><br></br>
      <Link to = "/Subjects"> Subjects </Link><br></br>
      <Link to = "/AcademicYears"> Academic Years </Link><br></br>
      <Link to = "/SelectSubject"> Select Your Subject </Link><br></br>
      <Link to = "/StudentAttendence">Student Attendence </Link>


    </div>

  )

}