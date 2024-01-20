import React from 'react'
import './View_attendance.css';
import { VscCheck } from "react-icons/vsc";
import { VscClose } from "react-icons/vsc";

export default function Attendance() {
  return (
    <div className='table-wrapper'>
        <table className='table'>
            <thead className='expand'>
                <tr>
                    <th>Name</th>
                    <th>Registration Number</th>
                    <th>Present</th>
                    <th>Absent</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Saman</td>
                    <td>19APC4001</td>
                    <td>
                        <span><VscCheck /></span>
                    </td>
                    <td></td>

                </tr>
                <tr>
                    <td>Nimal</td>
                    <td>19APC4003</td>
                    <td></td>
                    <td>
                        <span><VscClose /></span>
                    </td>

                </tr>
                <tr>
                    <td>Sunil</td>
                    <td>19APC4005</td>
                    <td>
                        <span><VscCheck /></span>
                    </td>
                    <td></td>
                </tr>
                <tr>
                    <td>Nimal</td>
                    <td>19APC4003</td>
                    <td></td>
                    <td>
                        <span><VscClose /></span>
                    </td>

                </tr>
            </tbody>
        </table>
    </div>
  )
}
