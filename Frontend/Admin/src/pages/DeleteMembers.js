import React from 'react'
import '../../src/DeleteMembers.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
// import Footer from '../components/Footer';
import { FaTrash } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";



// import{BsFillPencilFill,BsFillTrashFill} from "react-icons/bs";


export default function() {
  return (

    <section>

    <Header/>
    <Sidebar/>
    {/* <Footer/> */}
    <div className='table-wrapper'>

      <table className='table'>
          <thead>
              
              <tr>
                 <th className='expand'>Name</th>
                 <th>ID</th>
                 <th>NIC</th>
                 <th className='expand'>Email</th>
                 <th>Contact</th>
                 <th>Action</th>
              </tr>
          </thead>              
             
          

          <tbody>
                <tr>
                   <td>Nimal</td>
                   <td>001</td>
                   <td>200018</td>
                   <td>Nimal@gmai.com</td>
                   <td>119</td>
                   <td>
                      <span className='actions'>
                      <FaPencilAlt />
                      <FaTrash className='delete-btn' />
                      </span>
                   </td> 
                </tr>
                <tr>
                   <td>Nimal</td>
                   <td>001</td>
                   <td>200018</td>
                   <td>Nimal@gmai.com</td>
                   <td>119</td>
                   <td>
                      <span className='actions'>
                      <FaPencilAlt />
                      <FaTrash className='delete-btn' />
                      </span>
                   </td> 
                </tr>
                <tr>
                   <td>Nimal</td>
                   <td>001</td>
                   <td>200018</td>
                   <td>Nimal@gmai.com</td>
                   <td>119</td>
                   <td>
                      <span className='actions'>
                      <FaPencilAlt />
                      <FaTrash className='delete-btn'/>
                      </span>
                   </td> 
                </tr>
            


          </tbody>
      </table>
    </div>

    </section>

    
  )
}
