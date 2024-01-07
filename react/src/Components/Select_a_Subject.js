import { useState } from "react";

export default function Select_a_Subject() {
  const [cards] = useState([
    {},
    {},
  ]);

  const handleButtonClick = (cardIndex, buttonIndex) => {
    console.log(`Button clicked on Card ${cardIndex}, Lecture ${buttonIndex + 1}`);
  };

  return (
    <div>
      <section>
        <div className="container">
          <div className="cards">
            {cards.map((card, i) => (
              <div key={i} className="card1">
                {[0, 1, 2, 3].map((buttonIndex) => (
                  <button
                    key={buttonIndex}
                    onClick={() => handleButtonClick(i, buttonIndex)}
                    className="card-button1"
                  >
                    Lecture {buttonIndex + 1}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="button-container1">
        <button className="bottom-button1">Add more Lectures</button>
      </div>
    </div>
  );
}
