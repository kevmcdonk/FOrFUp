import { useState, useEffect } from "preact/hooks";
import { v4 as uuidv4 } from 'uuid';
import Counts from './Counts';

export default function ListResults() {
  const [responseMessage, setResponseMessage] = useState<Record<string, Record<number, number>>>({});
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);

  let itemOneClassName = "pill";
  let itemTwoClassName = "pill";
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  
type Entry = {
   id: string;
dateLogged: string;
humanWord: string | null;
aiWord: string | null;
guess: number;
};


  useEffect(() => {
    
    function groupAndCount(data: Entry[]) {
    const result: Record<string, Record<number, number>> = {};

    for (const item of data) {
      const guess = item.guess;
      const word = item.humanWord;

      if (!word) continue;

      if (!result[word]) {
        result[word] = [0, 0];
      }
      let fdCount = result[word][0];
      let fdupCount = result[word][1];

      if (guess == 0) {
        fdCount++;
      }
      else if (guess == 1) {
        fdupCount++;
      }
      result[word] = [fdCount, fdupCount];
    }
    return result;

    async function fetchData() {
      /*const response = await fetch("/api/ListJudgements", {
        method: "GET",
      });
      const data = await response.json();*/

      const data = [
          {
              "id": "6f22568c-b7b9-4c9a-8751-4844689d19dc",
              "dateLogged": "2025-05-24T21:55:43.74Z",
              "humanWord": "Bananad",
              "aiWord": null,
              "guess": 1
          },
          {
              "id": "6f22568c-b7b9-4c9a-8751-4844689d19dd",
              "dateLogged": "2025-05-24T21:55:43.74Z",
              "humanWord": "Bananad",
              "aiWord": null,
              "guess": 1
          },
          {
              "id": "6f22568c-b7b9-4c9a-8751-4844689d19de",
              "dateLogged": "2025-05-24T21:55:43.74Z",
              "humanWord": "Bananad",
              "aiWord": null,
              "guess": 0
          }
      ];
      if (data) {
        const groupedData = groupAndCount(data);
        setResponseMessage(groupedData);
      }
    }

    fetchData();
  }, []);


  return (
    <div>
    {Object.keys(responseMessage).length > 0 ? (
      <div>
        
      <ul class="grid small">
      {Object.keys(responseMessage).length > 0 ? (
        Object.entries(responseMessage).map(([word, counts], index) => (
          <li key={index}>
            <h3>{word}</h3>
            <div className="pill-selected">
              Fucked: {counts[0]}
            </div>
            <div className="centred">
              vs
            </div>
            <div className="pill-selected">
              Fucked up: {counts[1]}
            </div>
          </li>
        ))
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