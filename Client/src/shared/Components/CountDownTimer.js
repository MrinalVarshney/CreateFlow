import "./CountDownTimer.css";
import React, { useState, useEffect } from "react";
import { useUserAndChats } from "../../Context/userAndChatsProvider";



function CountdownTimer({ startTimer, scoreCard }) {
  const { Socket, time, rounds, roomDetails } = useUserAndChats();
  const [timeLeft, setTimeLeft] = useState(time); // Initial time in seconds
  const socket = Socket.current;
  // console.log("scoreCardfirst", scoreCard);

  // Update the time left every second when the timer is running

  useEffect(() => {
    setTimeLeft(time);
  }, []);

  const updateScoresForUser = (userId, newScore) => {
    // drawer score update
    const drawerScore = Math.round(
      200 / (roomDetails?.participants.length - 1)
    );
    console.log("drawscore", drawerScore);
    scoreCard.current = scoreCard?.current.map((user) =>
      user?.userId === roomDetails?.roomCreator.userId
        ? { ...user, scores: user.scores + drawerScore }
        : user
    );

    // guessed person score update
    scoreCard.current = scoreCard?.current.map((user) =>
      user?.userId === userId
        ? { ...user, scores: user.scores + newScore }
        : user
    );
  };

  useEffect(() => {
    socket?.on("word-Selected", (data) => {
      console.log("time asdf", time);
      setTimeLeft(time);
    });
    socket?.on("timer", () => {
      console.log("timer event came: current time", timeLeft, time);
      if (timeLeft === 0) {
        console.log("becoming 0");
        setTimeLeft(time);
        let roundsPlayed =
          parseInt(localStorage.getItem("roundsPlayed"), 10) || 1;
        console.log("roundsPlayed", roundsPlayed, "out of ", rounds);
        localStorage.setItem("roundsPlayed", roundsPlayed + 1);
      } else {
        setTimeLeft(timeLeft - 1);
      }
    });
    socket?.on("guessed", (data) => {
      const newScore = Math.round(200 * (timeLeft / time));
      console.log("updated scoreCard before", scoreCard, newScore);
      updateScoresForUser(data.userId, newScore);
      console.log("updated scoreCard", scoreCard, newScore);
    });
    return () => {
      // socket?.off("word-Selected");
      socket?.off("timer");
      socket?.off("guessed");
    };
  }, [socket, time, timeLeft, scoreCard]);

  return (
    <div className="countdown-timer">
      <p className="time-left">Time Left: {timeLeft} seconds</p>
  
    </div>
  );
}

export default CountdownTimer;
