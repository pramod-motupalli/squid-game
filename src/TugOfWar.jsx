import React, { useState, useEffect, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";

const TugOfWar = () => {
    const navigate = useNavigate();
    const disableCopy = (e) => {
        e.preventDefault();
    };
    // Duration of the challenge in seconds (15 minutes)
    const challengeDuration = 900;

    const [challengeStartTime, setChallengeStartTime] = useState(null);
    useEffect(() => {
        function fetchChallengeStartTime() {
            try {
                const simulatedStartTime = new Date("2025/03/10 16:51:00");

                setChallengeStartTime(simulatedStartTime);
            } catch (error) {
                console.error("Failed to fetch challenge start time:", error);
            }
        }
        fetchChallengeStartTime();
    }, []);
    useEffect(() => {
        const fetchPlayerId = async () => {
            const username = localStorage.getItem("username");
            if (!username) {
                setError("Username not found in localStorage");
                // setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    "https://squidgamebackend.onrender.com/api/player",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ username }),
                    }
                );

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error("Network response was not ok: " + text);
                }

                const contentType = response.headers.get("content-type");
                let data;
                if (contentType && contentType.includes("application/json")) {
                    data = await response.json();
                } else {
                    const rawText = await response.text();
                    try {
                        data = JSON.parse(rawText);
                    } catch (parseError) {
                        throw new Error(
                            "Failed to parse JSON from response: " +
                                parseError.message
                        );
                    }
                }
                if (data && data.playerId) {
                    setPlayerId(data.playerId);
                    localStorage.setItem("playerid", data.playerId);
                } else {
                    throw new Error("Invalid data format received");
                }
            } catch (err) {
                console.error("Error fetching player ID:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayerId();
    }, []);
    // Calculate the target time (challenge end time) when challengeStartTime is available.
    const targetTime = challengeStartTime
        ? challengeStartTime.getTime() + challengeDuration * 1000
        : null;

    const [timeLeft, setTimeLeft] = useState(challengeDuration);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [ropePosition, setRopePosition] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [level2pair, setPairId] = useState("");
    const [playerid, setPlayerId] = useState("");
    const tugWarControls = useAnimation();
    const totalQuestions = 10;
    const questions = [
        {
            question:
                "If January 1, 2024 is a Monday, what day of the week will October 31, 2024 be?",
            options: ["Tuesday", "Wednesday", "Thursday", "Friday"],
            answer: "Thursday",
            marks: 10,
        },
        // {
        //   question: "Raman is confident of speaking English ______ six months, as he has been practicing regularly ____ the last three weeks.",
        //   options: ["during, for", "for, since", "for, in", "within, for"],
        //   answer: "within, for",
        //   marks: 10
        // },
        {
            question:
                "A train traveling at 60 km/hr departs a station at 8:00 AM. A second train traveling at 80 km/hr leaves the same station at 8:30 AM in the same direction. At what time will the second train catch up with the first?",
            options: ["9:30 AM", "10:00 AM", "10:15 AM", "10:30 AM"],
            answer: "10:00 AM",
            marks: 10,
        },
        // {
        //   question: "In a family, R is the son of S. S is the sister of T, and T is the mother of U. U is the wife of V. What is the relation of V to S?",
        //   options: ["Nephew-in-law", "Cousin-in-law", "Son-in-law", "Brother-in-law"],
        //   answer: "Nephew-in-law",
        //   marks: 10
        // },
        // {
        //   question: "Select the word that best completes the analogy: 'Luminous is to radiant as tenebrous is to ______.'",
        //   options: ["gloomy", "vivid", "bright", "sparkling"],
        //   answer: "gloomy",
        //   marks: 10
        // },
        {
            question:
                "Find the next term in the sequence: 7G, 11K, 13Q, 17U, ___, given that the numeric parts are consecutive prime numbers and the letters are obtained by alternately adding 4 and 6 to the previous term’s letter position (with A=1, Z=26).",
            options: ["19A", "19B", "19C", "19D"],
            answer: "19A",
            marks: 10,
        },
        // {
        //   question: "If 12 men can build a wall in 15 days, how many days will it take 20 men to build the same wall?",
        //   options: [9, 10, 12, 15],
        //   answer: 9,
        //   marks: 5
        // },
        // {
        //   question: "A mixture contains milk and water in the ratio 3:2. If 10 litres of water are added to 25 litres of this mixture, what is the new ratio of milk to water?",
        //   options: ["3:7", "3:11", "1:2", "1:3"],
        //   answer: "3:11",
        //   marks: 10
        // },
        // {
        //   question: "Two alloys contain copper and zinc in the ratios 4:1 and 3:2 respectively. In what ratio should the two alloys be mixed so that the resulting alloy has copper and zinc in the ratio 17:7?",
        //   options: ["13:11", "11:13", "4:3", "3:4"],
        //   answer: "13:11",
        //   marks: 10
        // },
        // {
        //   question: "What is the derivative of f(x) = (2x^3 - 5x + 1)^2 with respect to x?",
        //   options: [
        //     "2(2x^3 - 5x + 1)(6x^2 - 5)",
        //     "2(6x^2 - 5)",
        //     "(2x^3 - 5x + 1)(6x^2 - 5)",
        //     "4x^2(6x^2 - 5)"
        //   ],
        //   answer: "2(2x^3 - 5x + 1)(6x^2 - 5)",
        //   marks: 10
        // },
        // {
        //   question: "If 5 machines produce 5 widgets in 5 minutes, how many minutes will 100 machines take to produce 100 widgets?",
        //   options: [5, 10, 15, 20],
        //   answer: 5,
        //   marks: 10
        // },
        {
            question:
                "A school's student council has 12 members. How many different subcommittees of 4 can be formed?",
            options: [495, 330, 210, 120],
            answer: 495,
            marks: 10,
        },
        // {
        //   question: "If 60 men can complete a task in 10 days, how many days will 40 men take to complete the same task?",
        //   options: [10, 12, 15, 20],
        //   answer: 15,
        //   marks: 10
        // },
        {
            question:
                "Consider the sentences: (i) Everybody in the class is prepared for the exam. (ii) Babu invited Danish to his home because he enjoys playing chess. Which observation is correct?",
            options: [
                "(i) is grammatically correct and (ii) is unambiguous",
                "(i) is grammatically incorrect and (ii) is unambiguous",
                "(i) is grammatically correct and (ii) is ambiguous",
                "(i) is grammatically incorrect and (ii) is ambiguous",
            ],
            answer: "(i) is grammatically correct and (ii) is ambiguous",
            marks: 10,
        },
        // {
        //   question: "Select the term that best completes the analogy: 'Taylor Swift : Grammy Awards as Serena Williams : ______', emphasizing their pinnacle achievements in their respective fields.",
        //   options: ["Olympic gold medals", "Grand Slam titles", "World Championship titles", "Career earnings"],
        //   answer: "Grand Slam titles",
        //   marks: 10
        // },
        {
            question:
                "Directions: Refer to the following data: In a survey of 100 students, 60 like Mathematics, 45 like Science, and 30 like both subjects. How many students like only Science?",
            options: ["15", "30", "45", "60"],
            answer: "15",
            marks: 10,
        },
        {
            question:
                "In a family, if A is the sister of B, B is married to C, and C is the sister of D, who is the mother of E, what is the relation of A to E?",
            options: ["Aunt", "Cousin", "Sister", "Grandmother"],
            answer: "Aunt",
            marks: 10,
        },
        {
            question:
                "Directions: From town A, travel 3 km east, then 4 km north, then 5 km west, and finally 2 km south to reach town B. In which direction from town A is town B located?",
            options: ["North-West", "North-East", "South-West", "South-East"],
            answer: "North-West",
            marks: 10,
        },
        // {
        //   question: "If 12 men can build a wall in 15 days, how many days will it take 20 men to build the same wall?",
        //   options: [9, 10, 12, 15],
        //   answer: 9,
        //   marks: 10
        // },
        // {
        //   question: "If January 1, 2025 is a Wednesday, what day of the week will December 31, 2025 fall on?",
        //   options: ["Tuesday", "Wednesday", "Thursday", "Friday"],
        //   answer: "Wednesday",
        //   marks: 10
        // },
        // {
        //   question: "A train traveling at 60 km/hr departs a station at 8:00 AM. A second train traveling at 80 km/hr leaves the same station at 8:30 AM in the same direction. At what time will the second train catch up with the first?",
        //   options: ["9:30 AM", "10:00 AM", "10:15 AM", "10:30 AM"],
        //   answer: "10:00 AM",
        //   marks: 10
        // },
        {
            question:
                "In a family, if A is the daughter of B, B has two children, A and C. C is married to D, and they have a daughter E. What is the relation of E to A?",
            options: ["Sister", "Cousin", "Niece", "Aunt"],
            answer: "Niece",
            marks: 10,
        },
        // {
        //   question: "A tank is filled by two pipes A and B. Pipe A can fill the tank in 12 hours, and pipe B can fill it in 18 hours. How long will it take to fill the tank if both pipes are used together?",
        //   options: ["7.2 hours", "8 hours", "9 hours", "10 hours"],
        //   answer: "7.2 hours",
        //   marks: 10
        // },
        {
            question:
                "A book costs Rs. 250. A discount of 10% is given on the marked price, and an additional discount of 5% is offered on the sale price. What is the final price of the book?",
            options: ["Rs. 210", "Rs. 213.75", "Rs. 220", "Rs. 225"],
            answer: "Rs. 213.75",
            marks: 10,
        },
    ];

    // Load saved answer for the current question (if any)
    useEffect(() => {
        const saved = localStorage.getItem(`answer-${currentQuestion}`);
        if (saved) {
            setSelectedAnswer(JSON.parse(saved));
        } else {
            setSelectedAnswer(null);
        }
    }, [currentQuestion]);

    // Fetch pairId and playerId from the backend
    useEffect(() => {
        async function fetchUserData() {
            try {
                const username = localStorage.getItem("username");
                const response = await fetch(
                    "https://squidgamebackend.onrender.com/level2pair",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username }),
                    }
                );
                const data = await response.json();
                console.log("Server response:", data);
                setPairId(data.level2pair);
                setPlayerId(data.playerid);
            } catch (error) {
                console.error("Failed to fetch pair and player IDs:", error);
            }
        }
        fetchUserData();
    }, []);

    // Optionally, log updated pair and player IDs when they change.
    useEffect(() => {
        console.log("Updated level2pair:", level2pair);
        console.log("Updated playerid:", playerid);
    }, [level2pair, playerid]);

    // Continuous oscillation for rope animation.
    useEffect(() => {
        const oscillateTugOfWar = async () => {
            while (!gameOver) {
                await tugWarControls.start({
                    x: 10,
                    transition: { duration: 0.5, yoyo: Infinity },
                });
                await tugWarControls.start({
                    x: -10,
                    transition: { duration: 0.5, yoyo: Infinity },
                });
            }
        };
        oscillateTugOfWar();
    }, [gameOver, tugWarControls]);

    // When a user selects an answer, update state and save locally.
    const handleOptionSelect = (option) => {
        setSelectedAnswer(option);
        localStorage.setItem(
            `answer-${currentQuestion}`,
            JSON.stringify(option)
        );
    };

    // Handle moving to the next question.
    const handleNextQuestion = () => {
        localStorage.setItem(
            `answer-${currentQuestion}`,
            JSON.stringify(selectedAnswer)
        );
        if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion((prev) => prev + 1);
        }
    };

    // Final submission: compute score, evaluate rope position, and decide navigation.
    const handleFinalSubmit = useCallback(async () => {
        localStorage.setItem(
            `answer-${currentQuestion}`,
            JSON.stringify(selectedAnswer)
        );
        setIsSubmitting(true);
        setErrorMessage("");

        let calculatedScore = 0;
        let calculatedRopePosition = 0;
        questions.forEach((q, index) => {
            const storedAnswer = localStorage.getItem(`answer-${index}`);
            if (storedAnswer) {
                const answer = JSON.parse(storedAnswer);
                if (answer === q.answer) {
                    calculatedScore += q.marks;
                }
            }
        });
        console.log("Calculated Score:", calculatedScore);
        setScore(calculatedScore);
        localStorage.setItem("score", calculatedScore);

        // Animate rope to its final position.
        tugWarControls.start({
            transition: { type: "spring", stiffness: 100 },
        });

        const submitTime = new Date().toISOString();
        try {
            const response = await fetch(
                "https://squidgamebackend.onrender.com/submitTugOfWar",
                {
                    method: "POST",
                    body: JSON.stringify({
                        playerid: localStorage.getItem("playerid"),
                        score: calculatedScore,
                    }),
                    headers: { "Content-Type": "application/json" },
                }
            );
            const data = await response.json();
            console.log("Server response:", data);
            try {
                const Score = localStorage.getItem("score");
                const playerid = localStorage.getItem("playerid");
                if (!playerid) {
                    console.error("Player ID not found.");
                    return;
                }
                console.log(playerid);
                // const response1 = await fetch("https://squidgamebackend.onrender.com/score1", {
                //   method: "POST",
                //   headers: { "Content-Type": "application/json" },
                //   body: JSON.stringify({ playerid: playerid, level2Score: Score }),
                // });

                const response = await fetch(
                    "https://squidgamebackend.onrender.com/user1",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ playerid }),
                    }
                );
                const playerData = await response.json();
                console.log(playerData);
                if (
                    playerData.user.level2pair === "solo player" &&
                    timeLeft === 0
                ) {
                    // console.log(timeLeft)
                    console.log(localStorage.getItem("score"));
                    if (localStorage.getItem("score") > 0) {
                        window.open(
                            "https://squidgame2k25.vercel.app/Level3instructions",
                            "_self"
                        );
                    } else {
                        window.open(
                            "https://squidgame2k25.vercel.app/TugOfWarDisqualified",
                            "_self"
                        );
                    }
                    return;
                }
                const opponentId = playerData.user.level2pair;
                console.log(opponentId);

                const oppResponse = await fetch(
                    "https://squidgamebackend.onrender.com/user1",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ playerid: opponentId }),
                    }
                );
                const opponentData = await oppResponse.json();
                console.log(opponentData);

                console.log("343");
                console.log(timeLeft);
                console.log(opponentData);

                if (
                    playerData.user.level2 &&
                    opponentData.user.level2 &&
                    timeLeft === 0
                ) {
                    if (
                        playerData.user.level2Score >
                        opponentData.user.level2Score
                    ) {
                        window.open(
                            "https://squidgame2k25.vercel.app/Level3instructions",
                            "_self"
                        );
                    } else if (
                        playerData.user.level2Score <
                        opponentData.user.level2Score
                    ) {
                        console.log("ji");
                    } else {
                        if (
                            playerData.user.level2Time >
                            opponentData.user.level2Time
                        ) {
                            window.open(
                                "https://squidgame2k25.vercel.app/Level3instructions",
                                "_self"
                            );
                        } else {
                            console.log("hi");
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching level 2 data:", error);
            }
        } catch (error) {
            if (error.response) {
                console.error("Server error:", error.response.data);
                setErrorMessage(
                    error.response.data.message || "Server error occurred."
                );
            } else if (error.request) {
                console.error("No response:", error.request);
                setErrorMessage(
                    "No response from server. Please try again later."
                );
            } else {
                console.error("Request error:", error.message);
                setErrorMessage("Error in request. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
            setGameOver(true);
        }
    }, [
        currentQuestion,
        selectedAnswer,
        questions,
        timeLeft,
        tugWarControls,
        navigate,
        playerid,
        level2pair,
    ]);

    // Sync timer with real-life time using the targetTime.
    useEffect(() => {
        if (!targetTime) return; // Wait until challengeStartTime is loaded
        const interval = setInterval(() => {
            const remaining = Math.max(
                0,
                Math.floor((targetTime - Date.now()) / 1000)
            );
            setTimeLeft(remaining);
            if (remaining === 0) {
                clearInterval(interval);
                // When time runs out, auto-submit the evaluated scores
                handleFinalSubmit();
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [targetTime, handleFinalSubmit]);
    useEffect(() => {
        async function scores1() {
            // try {
            //   const Score = localStorage.getItem(score);
            //   const playerid = localStorage.getItem("playerid");
            //   if (!playerid) {
            //     console.error("Player ID not found.");
            //     return;
            //   }
            //   const response1 = await fetch("https://squidgamebackend.onrender.com/score1", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ playerid: playerid, level2Score: Score }),
            //   });
            //   const response = await fetch("https://squidgamebackend.onrender.com/user1", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ playerid }),
            //   });
            //   const playerData = await response.json();
            //   console.log(playerData);
            //   const opponentId = playerData.user.level2pair;
            //   console.log(opponentId);
            //   if (opponentId !== "solo player") {
            //     const oppResponse = await fetch("https://squidgamebackend.onrender.com/user1", {
            //       method: "POST",
            //       headers: { "Content-Type": "application/json" },
            //       body: JSON.stringify({ playerid: opponentId }),
            //     });
            //     const opponentData = await oppResponse.json();
            //     console.log(opponentData);
            //   }
            //   console.log("343");
            //   console.log(timeLeft);
            //   console.log(timeLeft === 900);
            //   if (
            //     playerData.user.level2pair === "solo player" &&
            //     timeLeft === 0
            //   ) {
            //     console.log(localStorage.getItem("score"));
            //     if (localStorage.getItem("score") > 0) {
            //       navigate("/Level3instructions");
            //     } else {
            //       navigate("/TugOfWarDisqualified");
            //     }
            //     return;
            //   }
            //   if (playerData.user.level2 && opponentData.user.level2) {
            //     if (playerData.user.level2Score > opponentData.user.level2Score) {
            //       navigate("/Level3instructions");
            //     } else if (playerData.user.level2Score < opponentData.user.level2Score) {
            //       console.log("ji");
            //     } else {
            //       if (playerData.user.level2Time > opponentData.user.level2Time) {
            //         navigate("/Level3instructions");
            //       } else {
            //         console.log("hi");
            //       }
            //     }
            //   }
            // } catch (error) {
            //   console.error("Error fetching level 2 data:", error);
            // }
        }

        scores1();
    }, [navigate]);
    const handleSubmit = useCallback(async () => {
        // Save the selected answer for the current question.
        localStorage.setItem(
            `answer-${currentQuestion}`,
            JSON.stringify(selectedAnswer)
        );
        setIsSubmitting(true);
        setErrorMessage("");
    
        let calculatedScore = 0;
        questions.forEach((q, index) => {
            const storedAnswer = localStorage.getItem(`answer-${index}`);
            if (storedAnswer) {
                const answer = JSON.parse(storedAnswer);
                if (answer === q.answer) {
                    calculatedScore += q.marks;
                }
            }
        });
        console.log("Calculated Score:", calculatedScore);
        setScore(calculatedScore);
        localStorage.setItem("score", calculatedScore);
    
        // Animate rope to its final position and wait for the animation to complete.
        await tugWarControls.start({
            transition: { type: "spring", stiffness: 100 },
        });
    
        // Optionally, capture the submit time if needed later.
        const submitTime = new Date().toISOString();
        
        try {
            const response = await fetch(
                "https://squidgamebackend.onrender.com/buttonsubmitTugOfWar",
                {
                    method: "POST",
                    body: JSON.stringify({
                        playerid: localStorage.getItem("playerid"),
                        score: calculatedScore,
                        timeLeft,
                    }),
                    headers: { "Content-Type": "application/json" },
                }
            );
    
            // Check if the response is not OK.
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Server error occurred.");
            }
        } catch (error) {
            console.error("Error submitting:", error.message);
            setErrorMessage(error.message || "An error occurred. Please try again later.");
        } finally {
            setIsSubmitting(false);
            setGameOver(true);
        }
    }, [
        currentQuestion,
        selectedAnswer,
        questions,
        timeLeft,
        tugWarControls,
    ]);
    

    const minutes = Math.floor(timeLeft / 60);
    const seconds = String(timeLeft % 60).padStart(2, "0");

    return (
        <div className="flex flex-col items-center p-6 min-h-screen bg-black text-white"onCopy={disableCopy}>
            <div className="absolute top-4 left-4 px-8 py-4 rounded-md text-yellow-400 font-bold text-xl">
                Player ID: {localStorage.getItem("playerid") || "Guest"}
            </div>
            <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center">
                Tug of War Challenge
            </h1>
            <p className="mb-2">
                Question {currentQuestion + 1} of {totalQuestions}
            </p>
            <p className="text-lg text-center max-w-xl mb-4">
                Answer all questions! The team with the highest score wins. If
                scores are tied, the fastest team wins!
            </p>
            <p className="text-xl font-bold text-red-400 mb-4">
                ⏳ Time Left: {minutes}:{seconds}
            </p>

            <motion.div
                className="relative w-1/2 h-40 flex justify-between items-center mt-4"
                animate={tugWarControls}
            >
                <motion.img
                    src="/images/TeamA.png"
                    alt="Team A"
                    className="w-32 h-32 z-10"
                    animate={{ x: -ropePosition / 2 }}
                    transition={{ type: "spring", stiffness: 100 }}
                />
                <motion.div
                    className="absolute top-[53%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-full h-2 bg-yellow-800"
                    style={{ zIndex: 1 }}
                    animate={{ x: ropePosition }}
                    transition={{ type: "spring", stiffness: 100 }}
                />
                <motion.img
                    src="/images/TeamB.png"
                    alt="Team B"
                    className="w-32 h-32 z-10"
                    animate={{ x: ropePosition / 2 }}
                    transition={{ type: "spring", stiffness: 100 }}
                />
            </motion.div>

            <div className="my-6 w-1/2 flex justify-center"onCopy={disableCopy}>
                <div className="bg-gray-800 p-4 rounded-lg text-center w-full"onCopy={disableCopy}>
                    <p className="mt-2 text-xl">
                        {questions[currentQuestion]?.question}
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        {questions[currentQuestion]?.options.map(
                            (option, index) => (
                                <button
                                    key={index}
                                    className={`px-4 py-2 rounded text-white ${
                                        selectedAnswer === option
                                            ? "bg-blue-600"
                                            : "bg-gray-700"
                                    } hover:bg-blue-800`}
                                    onClick={() => handleOptionSelect(option)}
                                    disabled={isSubmitting}
                                >
                                    {option}
                                </button>
                            )
                        )}
                    </div>
                    <div className="mt-4 flex justify-between">
                        <button
                            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded"
                            onClick={() =>
                                setCurrentQuestion((prev) =>
                                    Math.max(prev - 1, 0)
                                )
                            }
                            disabled={currentQuestion === 0 || isSubmitting}
                        >
                            Previous
                        </button>
                        {currentQuestion === totalQuestions - 1 ? (
                            <button
                                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                                onClick={() => {
                                    window.alert("Submission successful!");
                                    handleSubmit();
                                }}
                                disabled={gameOver || isSubmitting}
                            >
                                {isSubmitting ? "Submitting..." : "submit"}
                            </button>
                        ) : (
                            <button
                                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                                onClick={handleNextQuestion}
                                disabled={isSubmitting}
                            >
                                Next
                            </button>
                        )}
                    </div>
                    {/* <button
                        onClick={() => window.open("https://squidgame2k25.vercel.app/Level3instructions", "_self")}
                        className="mt-6 px-6 py-3 text-lg font-bold rounded bg-teal-500 hover:bg-teal-700 text-white"
                        disabled={isSubmitting}
                    >
                        Next Level
                    </button>
                    {errorMessage && (
                        <p className="text-red-500 mt-4 text-center">
                            {errorMessage}
                        </p>
                    )} */}
                </div>
            </div>
        </div>
    );
};

export default TugOfWar;
