/*
import React, { useState } from "react";
import Sidedefault from './Sidedefault';


function Dashboard()

    {
const [cards]= useState([
    {
        // title:'Sub01', 
        title:`Digital Innovation`
    },
    {
        // title:'Sub02', 
        title:`E-business`
    },
    {
        // title:'Sub03', 
        title:`Data Structures & Algorithms`
    },
    {
        // title:'Sub04', 
        title:`IS Risk  Management`
    },
    {
        // title:'Sub05', 
        title:`IT Governance`
    },
    {
         // title:'Sub06', 
        title:`Academic English`
    },
])
        return(
    <div className="sect1234">
    <Sidedefault/>
        
            <div className="container_dashboard">
            <h1>Lecture Subjects</h1>
            <div className="cards-1234">
                {
                    cards.map((card,i) => (
                        <div key={i} className="card-1234">

                            <h3>{card.title}</h3>
                            <p>{card.text}</p> 
                           
                           
                            
                        </div>
                    ))
                  
                }
                  
                </div>

                    <button className="button-abcd">Log Out</button>
            </div>
            </div>
           
        );

    }

export default Dashboard;

*/

/*
 <>
            <div className="Dashboard-container01">
            <div className="db01">
            Digital <br/> Innovation
            </div>
            <div className="db02">
            E-business
            </div>
            <div className="db03">
            Data <br/> Structures <br/>& Algorithms
            </div>
            </div>
            <div className="Dashboard-container02">
            <div className="db04">
            IS Risk <br/> Management
            </div>
            <div className="db05">
            IT Governance
            </div>
            <div className="db06">
            Academic <br/> English
            </div>
        </div>
        </>     

        */


        import React from 'react';
        import { useState } from 'react';
        import { VscError } from 'react-icons/vsc';
        import { useNavigate } from 'react-router-dom';
        import Sidedefault from './Sidedefault';
        import './Dashboard.css';
                
        export default function Dashboard() {
        const navigate = useNavigate();
                
                  const [cards] = useState([
                    {
                      title: 'Digital Innovation',
                    },
                    {
                      title: 'IS Risk Management',
                    },
                    {
                      title: 'Software Engineering',
                    },
                    {
                      title: 'IT Governance',
                    },
                    {
                      title: 'E-Business',
                    },
                    {
                      title: 'Data Structures',
                    },
                  ]);
                
                  const handleAddSubjects = () => {
                    navigate('/Add_Subject');
                  };
                
                  const handleCardClick = () => {
                    navigate('/Selectlesson');
                  };
                
                  return (
                    <div>
                        <Sidedefault/>
                      <section>
                        <div className="containe">
                          <div className="cards">
                            {cards.map((card, i) => (
                              <div key={i} className="card" onClick={handleCardClick}>
                                <h2>{card.title}</h2>
                                <span className="icon-container">
                                  <VscError />
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </section>
                      
                   
                    </div>
                  );
                }