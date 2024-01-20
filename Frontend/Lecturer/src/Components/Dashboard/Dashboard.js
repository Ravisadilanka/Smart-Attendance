import {useState} from "react";
import { VscError } from "react-icons/vsc";

export default function Dashboard(){
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
    ])
    return (
            <div>
            <section>
                <div className="containe">
                    <div className="cards" >
                        {
                            cards.map((card,i) => (
                                <div key={i} className="card">
                                    <h2>{card.title}</h2>
                                    <span className="icon-container"><VscError /></span>
                                    </div>
                        
                            ))
                        }
                    </div>
                </div>
            </section>
            <div className="button-container">
            <button className="bottom-button">Add more Subjects</button>
            </div>
        </div>
        
    )
}