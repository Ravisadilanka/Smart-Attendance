import React from 'react'
import Header from '../components/Header'
import {Outlet, Link}  from "react-router-dom";


export default function() {
  return (

    <div>
      <Header/>

      
      <h1>Link Page</h1>
      <Link to = "/ForgetPw"> Forget Password </Link><br></br>
      <Link to = "/EditProfile"> Edit Profile </Link><br></br>
      <Link to = "/DeleteMembers"> Delete Members </Link><br></br>
      <Link to = "/Subjects"> Subjects </Link><br></br>
      <Link to = "/AcademicYears"> Academic Years </Link><br></br>
      <Link to = "/SelectSubject"> Select Your Subject </Link><br></br>
      <Link to = "/StudentAttendence">Student Attendence </Link><br></br>
      <Link to = "/UserProfile">User Profile</Link><br></br>
      <Link to = "/EditStaff">Edit Staff</Link><br></br>
      <Link to = "/EditStudent">Edit Student</Link><br></br>
      <Link to = "/SignUp">Sign Up</Link><br></br>
      <Link to = "/Test">test</Link><br></br>

    </div>

  )

}