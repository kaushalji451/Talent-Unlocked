import React, { use, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useState } from "react";
import feedback from "../component/Feedback";
const Score = () => {
  const location = useLocation();
  const userId = location.state.userId;
  const score = location.state.score;
  let totalScore = Math.floor((score.rightAnswer / score.totalQuestion) * 100);
  const minutes = Math.floor(score.timeLeft / 60);
  const seconds = score.timeLeft % 60;
  const timeLeftInMMSS = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  const [scoreDetails, setscoreDetails] = useState({
    totalQuestion: score.totalQuestion,
    timeLeft: timeLeftInMMSS,
    correctAnswer: score.rightAnswer,
    percentage: totalScore,
  });
  useEffect(() => {
    const submittedKey = `submitted_${userId}`;
    const alreadySubmitted = sessionStorage.getItem(submittedKey);

    if (!alreadySubmitted) {
      const handleDataSubmit = async () => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/score?userId=${userId}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(scoreDetails),
            }
          );
          const result = await res.json();
          console.log("Score submitted:", result);

          const emailRes = await fetch(
            `${import.meta.env.VITE_API_URL}/sendEmail?userId=${userId}`
          );
          const emailResult = await emailRes.json();
          console.log("Email sent:", emailResult);

          sessionStorage.setItem(submittedKey, "true"); // Mark as submitted
        } catch (error) {
          console.error("Error submitting data:", error);
        }
      };

      handleDataSubmit();
    }
  }, [userId, scoreDetails]);

  return (
    <>
      <div className="flex justify-center h-[100vh]  items-center flex-col  bg-slate-100">
        <div className="bg-white p-10 rounded-xl flex flex-col gap-4 bg-white shadow-xl">
          <p className="text-3xl font-bold text-green-500 text-center">Congratulation !</p>
          <p className="text-3xl font-semibold text-center">Your Assessment was submited</p>
          <div className="flex flex-col gap-2">
            <p className="text-xl font-semibold flex justify-between border px-3 border-slate-400 bg-slate-100 rounded-xl py-1">
              Total Questions{" "}
              <span className="ps-6">{score.totalQuestion}</span>
            </p>
            <p className="text-xl font-semibold flex justify-between border px-3 border-slate-400 bg-slate-100 rounded-xl py-1">
              Total Correct Answers{" "}
              <span className="ps-6">{score.rightAnswer}</span>
            </p>
            <p className="text-xl font-semibold flex justify-between border px-3 border-slate-400 bg-slate-100 rounded-xl py-1">
              Your Score is <span className="ps-6">{totalScore}%</span>
            </p>
            {feedback()}
          </div>
          <div className="flex flex-col gap-2">
            <Link
              to={"/login"}
              className=" px-5 py-2.5 text-center me-2 mb-2"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Score;
