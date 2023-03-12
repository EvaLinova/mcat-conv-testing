import data from "./thesisData.json";
import { useEffect, useState } from "react";
import style from "./style.css";
import Countdown from "react-countdown";

function App() {
  const [interact, setInteract] = useState(false);
  const [changeTest, setChangeTest] = useState(false);
  const [timeOver, setTimeOver] = useState(false);

  return (
    <main className="mainAppClass">
      {interact && (
        <Countdown
          onComplete={() => setTimeOver(true)}
          date={Date.now() + 1200000}
          className="timer"
        />
      )}

      <div className="questionsDiv" onClick={() => setInteract(true)}>
        {changeTest ? (
          <MCAT timeOver={timeOver} setTimeOver={setTimeOver} />
        ) : (
          <ConvTest timeOver={timeOver} setTimeOver={setTimeOver} />
        )}

        {/* depending on if changeTest is true or false we show the test */}
      </div>
      <button
        className="switchTestButton"
        onClick={() => setChangeTest(!changeTest)}
      >
        SWITCH
      </button>
    </main>
  );
}

function MCAT({ timeOver, setTimeOver }) {
  const [indexArray, setIndexArray] = useState(0);
  const [difficulty, setDifficulty] = useState(10);
  const [score, setScore] = useState(0);
  const [currentData, setCurrentData] = useState(data.medium);

  function answerCheck(answer) {
    if (indexArray < 23) {
      setIndexArray(indexArray + 1);
    } else {
      setTimeOver(true);
      return;
    }

    if (currentData[indexArray].correctAnswer === answer) {
      // if answer is right
      setDifficulty(difficulty + 1);
      if (difficulty < 10) {
        setScore(score + 1);
      } else if (difficulty >= 10 && difficulty <= 20) {
        setScore(score + 2);
      } else {
        setScore(score + 3);
      }
    } else {
      // if answer is wrong
      setDifficulty(difficulty - 1);
    }
  }

  let easyLevelQuestions = [];
  let mediumLevelQuestions = [];
  let hardLevelQuestions = [];

  for (let x = 0; x < 24; x++) {
    easyLevelQuestions.push(data.easy[x]);
    mediumLevelQuestions.push(data.medium[x]);
    hardLevelQuestions.push(data.hard[x]);
  }

  useEffect(() => {
    if (difficulty < 10) {
      setCurrentData(easyLevelQuestions);
    } else if (difficulty >= 10 && difficulty <= 20) {
      setCurrentData(mediumLevelQuestions);
    } else {
      setCurrentData(hardLevelQuestions);
    }
  }, [difficulty]);

  return (
    <>
      <h1>MCAT</h1>
      <h2>{currentData[indexArray].question}</h2>

      <button
        onClick={(event) => answerCheck(event.target.innerHTML)}
        className="optionButton"
      >
        {currentData[indexArray].a}
      </button>

      <button
        onClick={(event) => answerCheck(event.target.innerHTML)}
        className="optionButton"
      >
        {currentData[indexArray].b}
      </button>

      <button
        onClick={(event) => answerCheck(event.target.innerHTML)}
        className="optionButton"
      >
        {currentData[indexArray].c}
      </button>
      <button
        onClick={(event) => answerCheck(event.target.innerHTML)}
        className="optionButton"
      >
        {currentData[indexArray].d}
      </button>

      {timeOver && (
        <div className="finishScreen">
          <h2>Tvé skóre je {score} a pro složení testu je třeba 40.</h2>
        </div>
      )}
    </>
  );
}

function ConvTest({ timeOver, setTimeOver }) {
  const [indexArray, setIndexArray] = useState(0); //this value is for the index of the object in the array
  const [correctAnswer, setCorrectAnswer] = useState([]); //this value is for the score of the student

  let questionArray = []; //empty array for storing new questions for conventional testing

  for (let x = 0; x < 8; x++) {
    questionArray.push(data.easy[x], data.medium[x], data.hard[x]);
  }

  //The for loop goes thru the array and pushes only 8 objects from the data array into the new array called questionArray

  console.log(timeOver);

  function answerCheck(answer) {
    setIndexArray(indexArray + 1);
    if (
      // We do this to give a point
      questionArray[indexArray].correctAnswer === answer &&
      !correctAnswer.includes(indexArray)
    ) {
      setCorrectAnswer([...correctAnswer, indexArray]);
    } else if (
      // We do this to take away a point if he had one and wants to edit to a wrong answer
      questionArray[indexArray].correctAnswer !== answer &&
      correctAnswer.includes(indexArray)
    ) {
      let dummyArray = correctAnswer; // we made it to modify the original array more easier

      const valueIndex = dummyArray.indexOf(indexArray); // we need the index number for a item to delete it from an array

      dummyArray.splice(valueIndex, 1);
      // we delete it from array dummyArray.splice(position of the item, how much should be deleted afterwards from the position)

      setCorrectAnswer(dummyArray); // we update our rightAnswers again

      if (indexArray < 23) {
        setIndexArray(indexArray + 1);
      } else {
        setTimeOver(true);
      }
    }
  }

  return (
    <div className="questionsDiv">
      <h1>Conventional Testing</h1>
      <h2>{questionArray[indexArray].question}</h2>
      <button
        className="optionButton"
        onClick={(event) => answerCheck(event.target.innerHTML)} //when the button is clicked, it will take the event and call the answerCheck function, target = button //when clicked, runs the answerCheck function (event.target.innerHTML = clicked option answer)
      >
        {/* information that happens when clicked/event only for this button, target = where the onclick event is*/}
        {questionArray[indexArray].a}
      </button>
      <button
        className="optionButton"
        onClick={(event) => answerCheck(event.target.innerHTML)}
      >
        {questionArray[indexArray].b}
      </button>
      {/* ... */}
      <button
        className="optionButton"
        onClick={(event) => answerCheck(event.target.innerHTML)}
      >
        {questionArray[indexArray].c}
      </button>
      <button
        className="optionButton"
        onClick={(event) => answerCheck(event.target.innerHTML)}
      >
        {questionArray[indexArray].d}
      </button>
      {indexArray > 0 && ( //because throwing error when less than zero, button for going back is not rendered
        <button
          className="switchButton"
          onClick={() => setIndexArray(indexArray - 1)}
        >
          GO BACK
        </button>
      )}
      <button
        className="switchButton"
        onClick={() => setIndexArray(indexArray + 1)}
      >
        NEXT QUESTION
      </button>
      {indexArray === 23 && (
        <div className="finishScreen">
          <h2> {Math.round((correctAnswer.length * 100) / 24)} %</h2>
          <h2> {correctAnswer.length} / 24 správných odpovědí!</h2>
        </div>
      )}
      {timeOver && (
        <div className="finishScreen">
          <h2> {Math.round((correctAnswer.length * 100) / 24)} %</h2>
          <h2> {correctAnswer.length} / 24 správných odpovědí!</h2>
        </div>
      )}
    </div>
  );
}

export default App;
