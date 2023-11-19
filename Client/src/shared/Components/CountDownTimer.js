import "./CountDownTimer.css";
import React, { useState, useEffect, useCallback } from "react";
import { useUserAndChats } from "../../Context/userAndChatsProvider";

function CountdownTimer({ startTimer }) {
  const { Socket, time } = useUserAndChats();
  const [timeLeft, setTimeLeft] = useState(time); // Initial time in seconds
  const [isRunning, setIsRunning] = useState(false);
  const socket = Socket.current;

  // Update the time left every second when the timer is running

  useEffect(() => {
    setTimeLeft(time);
  }, [time]);

  const handleStartClick = useCallback(() => {
    console.log("clicked timer");
    setTimeLeft(time);
    if (!isRunning) {
      setIsRunning(true);
    }
  }, [isRunning, time]);

  useEffect(() => {
    if (startTimer) handleStartClick();
  }, [startTimer]);

  useEffect(() => {
    socket?.on("word-Selected", (data) => {
      handleStartClick();
    });
    return () => {
      socket?.off("word-Selected", handleStartClick);
    };
  }, [handleStartClick, socket]);
  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        if (timeLeft > 0) {
          setTimeLeft(timeLeft - 1);
        } else {
          clearInterval(interval); // Stop the timer when it reaches 0
          setIsRunning(false);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval); // Cleanup to stop the interval when the component unmounts
    };
  }, [timeLeft, isRunning]);

  return (
    <div className="countdown-timer">
      <p className="time-left">Time Left: {timeLeft} seconds</p>
    </div>
  );
}

export default CountdownTimer;
