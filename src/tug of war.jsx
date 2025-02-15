import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const allQuestions = [
  { question: "What is 5 + 3?", answer: "8" },
  { question: "What comes next: 2, 4, 8, 16, ...?", answer: "32" },
  { question: "Solve: 15 - 7", answer: "8" },
  { question: "Find the missing number: 1, 1, 2, 3, 5, ?", answer: "8" },
  { question: "What is 9 * 9?", answer: "81" },
  { question: "What is the square root of 144?", answer: "12" },
  { question: "What is 100 / 4?", answer: "25" },
  { question: "Find the missing number: 3, 6, 9, 12, ?", answer: "15" },
  { question: "What is 7 + 6?", answer: "13" },
  { question: "What is 50 - 23?", answer: "27" },
  { question: "What is 11 * 11?", answer: "121" },
  { question: "What is the value of 2^5?", answer: "32" },
  { question: "Find the missing number: 10, 20, 30, ?, 50", answer: "40" },
  { question: "What is 45 + 55?", answer: "100" },
  { question: "What is 18 / 3?", answer: "6" }
];

const TugOfWar = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [teamScores, setTeamScores] = useState({ teamA: 0, teamB: 0 });
  const [submissionTimes, setSubmissionTimes] = useState({ teamA: [], teamB: [] });
  const [teamAnswers, setTeamAnswers] = useState({ teamA: "", teamB: "" });
  const [startTime, setStartTime] = useState(Date.now());
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const selectedQuestions = [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, 10);
    const teamAQuestions = [...selectedQuestions].sort(() => 0.5 - Math.random());
    const teamBQuestions = [...selectedQuestions].sort(() => 0.5 - Math.random());
    setQuestions({ teamA: teamAQuestions, teamB: teamBQuestions });
  }, []);

  const handleAnswer = (team, value) => {
    setTeamAnswers((prev) => ({ ...prev, [team]: value }));
  };

  const navigateQuestion = (direction) => {
    setCurrentQuestion((prev) => Math.max(0, Math.min(9, prev + direction)));
  };

  const submitAnswers = () => {
    const correctAnswerA = questions.teamA[currentQuestion].answer;
    const correctAnswerB = questions.teamB[currentQuestion].answer;
    const now = Date.now();
    let newScores = { ...teamScores };
    let newSubmissionTimes = { ...submissionTimes };

    if (teamAnswers.teamA === correctAnswerA) {
      newScores.teamA += 1;
      newSubmissionTimes.teamA.push(now - startTime);
    }
    if (teamAnswers.teamB === correctAnswerB) {
      newScores.teamB += 1;
      newSubmissionTimes.teamB.push(now - startTime);
    }

    setTeamScores(newScores);
    setSubmissionTimes(newSubmissionTimes);

    if (currentQuestion + 1 === 10) {
      if (newScores.teamA > newScores.teamB) alert("Team A wins!");
      else if (newScores.teamB > newScores.teamA) alert("Team B wins!");
      else {
        const teamAFastest = Math.min(...newSubmissionTimes.teamA);
        const teamBFastest = Math.min(...newSubmissionTimes.teamB);
        if (teamAFastest < teamBFastest) alert("Team A wins by time!");
        else alert("Team B wins by time!");
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-xl font-bold mb-4">Tug of War: Aptitude & Logic Face-off</h1>
      {questions.teamA && questions.teamB && (
        <>
          <p className="mb-2 font-medium">{questions.teamA[currentQuestion].question}</p>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Team A Answer"
              className="border p-2"
              value={teamAnswers.teamA}
              onChange={(e) => handleAnswer("teamA", e.target.value)}
            />
            <input
              type="text"
              placeholder="Team B Answer"
              className="border p-2"
              value={teamAnswers.teamB}
              onChange={(e) => handleAnswer("teamB", e.target.value)}
            />
          </div>
          <div className="flex gap-4 mt-4">
            <Button onClick={() => navigateQuestion(-1)} disabled={currentQuestion === 0}>Previous</Button>
            <Button onClick={() => navigateQuestion(1)} disabled={currentQuestion === 9}>Next</Button>
          </div>
          {currentQuestion === 9 && (
            <Button onClick={submitAnswers} className="mt-4">Submit Answers</Button>
          )}
        </>
      )}
    </div>
  );
};

export default TugOfWar;
