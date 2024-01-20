import React from 'react'
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
// import Footer from '../components/Footer';




// import{BsFillPencilFill,BsFillTrashFill} from "react-icons/bs";


export default function() {
  return (

    <section>

    <Header/>
    <Sidebar/>
    {/* <Footer/> */}
    <div className='table-wrapper'>

    <table className='table' border={1}>
        <tr className='tr'>
          <th  className='expand'><p>Name</p></th>
          <th>Registration Number</th>
          <th>Present</th>
          <th>Absent</th>
        </tr>

        <tr>
          <td>Saman</td>
          <td>19APC4100</td>
          <td>Present</td>
          <td>Absent</td>
        </tr>

        <tr>
          <td>Pawan</td>
          <td>19APC4102</td>
          <td>Present</td>
          <td>Absent</td>
        </tr>

        <tr>
          <td>Gayan</td>
          <td>19APC4103</td>
          <td>Present</td>
          <td>Absent</td>
        </tr>
      </table>

    </div>

      

   

    </section>

    
  )
}