import React, { useState } from 'react';



// import React,{UseState} from 'react';


export default function Header(){

    const [open, setOpen] = useState(false);



    return(
        <header className="header">
        <h1>Smart Attendance System</h1>
        </header>
        )
}



