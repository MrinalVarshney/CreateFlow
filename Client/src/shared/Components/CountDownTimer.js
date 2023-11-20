import "./CountDownTimer.css";
import React, { useState, useEffect, useCallback } from "react";
import { useUserAndChats } from "../../Context/userAndChatsProvider";

function CountdownTimer({ startTimer }) {
  const { Socket, time } = useUserAndChats();
  const [timeLeft, setTimeLeft] = useState(time); // Initial time in seconds
  const socket = Socket.current;

  // Update the time left every second when the timer is running

  useEffect(() => {
    setTimeLeft(time);
  }, []);

  useEffect(() => {
    socket?.on("word-Selected", (data) => {
      setTimeLeft(time);
    });
    socket?.on("timer", () => {
      setTimeLeft(timeLeft - 1);
    });
    return () => {
      socket?.off("word-Selected");
      socket?.off("timer");
    };
  }, [socket, time, timeLeft]);

  return (
    <div className="countdown-timer">
      <p className="time-left">Time Left: {timeLeft} seconds</p>
    </div>
  );
}

export default CountdownTimer;
