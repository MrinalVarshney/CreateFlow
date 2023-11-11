
import './CountDownTimer.css'
import React, { useState, useEffect } from 'react';

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(60); // Initial time in seconds
  const [isRunning, setIsRunning] = useState(false);

  // Update the time left every second when the timer is running
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

  const handleStartClick = () => {
    if (!isRunning) {
      setIsRunning(true);
    }
  };

  return (
    <div className="countdown-timer">
      <h1>Countdown Timer</h1>
      {isRunning ? (
        <p className="time-left">Time Left: {timeLeft} seconds</p>
      ) : (
        <button className="start-button" onClick={handleStartClick}>Start</button>
      )}
    </div>
  );
}

export default CountdownTimer;
