import { useState, useEffect } from "preact/hooks";
import { v4 as uuidv4 } from 'uuid';
import Pill from './Pill.astro';

export default function ListWords() {
  const [responseMessage, setResponseMessage] = useState<any[]>([]);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>("not set");
  const [selectedItemId, setSelectedItemId] = useState<string | null>("not set");
  let itemOneClassName = "pill";
  let itemTwoClassName = "pill";

  useEffect(() => {
    async function fetchData() {
      
      const response = await fetch("/api/ListResults", {
        method: "GET",
      });
      const data = await response.json();
      
      if (data) {
        data.forEach((experiment: any) => {
          experiment.isHumanFirst = Math.random() >= 0.5;
          experiment.guessSuccess = "";
          console.log(experiment);
        });
        setResponseMessage(data);
      }
    }

    fetchData();
  }, []);

  async function submit(e: MouseEvent, item: any, judgement: string) {
    e.preventDefault();
    console.log(e);
    
    const guess = {
      ID: uuidv4(), // Generate a new GUID
      DateLogged: new Date(),
      HumanWord: item.humanWord,
      AIWord: item.aiWord,
      Guess: judgement
    }
    
    const response = await fetch("/api/SubmitGuess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(guess),
    });
    const data = await response;

    let itemOneClassName = "pill";
    let itemTwoClassName = "pill";
    setSelectedItemId("not set");
  }

  return (
      <div>
      {responseMessage.length > 0 ? (
        <div>
        <ul class="grid small">
        {responseMessage.length > 0 ? (
          responseMessage.map((item, index) => {
            if (item.humanWord.startsWith("\"")) {
              item.humanWord = item.humanWord.substring(1, item.humanWord.length - 1);
            }
            
            return (
              <li key={index}>
                <h2>{item.humanWord}</h2>
                <div 
                  className={itemOneClassName}
                  onMouseOver={() => setHoveredItemId("index" + index.toString() + "1")}
                  onMouseOut={() => setHoveredItemId("not set")}
                  onClick={(e) => {
                    setSelectedItemId("selectedIndex" + index.toString() + "1");
                    item.guessSuccess = "Get fucked";
                    submit(e, item, item.isHumanFirst ? "Human" : "AI");
                  }}
                >
                  <slot>Fucked</slot>
                </div>
                <div className={"centred"}>
                  or
                </div>
                <div 
                  className={itemTwoClassName}
                  onMouseOver={() => setHoveredItemId("index" + index.toString() + "2")}
                  onMouseOut={() => setHoveredItemId("not set")}
                  onClick={(e) => {
                    item.guessSuccess = "Get fucked up";
                    submit(e, item, item.isHumanFirst ? "AI" : "Human");
                  }}
                >
                  <slot>Fucked up</slot>
                </div>
                <div>{item.guessSuccess}</div>
              </li>
            );
          })
        ) : (
          <li>No results found</li>
        )}
      </ul></div>
      ) : (
        <p>Loading results</p>
      )}
      </div>
  );
}