import Lottie from "react-lottie";
import animationData from "./Animations/trophy.json"; // Replace with the path to your Lottie animation JSON file
import leaderBackground from "./Animations/leaderboard-bg.jpg"
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPaintBrush } from '@fortawesome/free-solid-svg-icons';

import React, { useState } from "react";
import "./LeaderBoard.css"; // Import the updated LeaderboardBox styles

function Leaderboard({ scoreCard }) {
  // const [players, setPlayers] = useState([
  //   { name: "Player 1", score: 100 },
  //   { name: "Player 2", score: 110 },
  //   { name: "Player 3", score: 90 },
  //   // Add more players and scores as needed
  // ]);

  const defaultOptions = {
    loop: true, // Set to true if you want the animation to loop
    autoplay: true, // Set to true to start the animation automatically
    animationData: animationData, // The animation data imported above
  };

  // Sort players by score in descending order
  console.log(typeof scoreCard.current, scoreCard.current);
  scoreCard.current.sort((a, b) => b.scores - a.scores);

  let roundsPlayed = parseInt(localStorage.getItem("roundsPlayed"), 10) || 1;
  const maxScore = 200 * roundsPlayed;

  return (
    <div className="leaderboard-box" style={{backgroundImage:`url(${leaderBackground})`,backgroundSize:"cover",backgroundRepeat:"no-repeat",backgroundPosition:"center center",height:"90%", width:"25%" }}>
      <div className="overlay">
      <div className="header">
        <Lottie options={defaultOptions}  style={{width:"auto"}} />
        <h1>Leaderboard</h1>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {scoreCard?.current.map((player, index) => (
            <tr key={index}>
              <td>
                <div className="user-profile">
                  <img
                    src=/*{player.profilePic}*/ "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                    alt={player?.userName}
                    width="50"
                    height="50"
                  />
                  {player?.userName}
                  <div
                    className="score-line"
                    style={{
                      width: `${((player?.scores + 1) / maxScore) * 200}px`,
                    }}
                  >
                  </div>
                </div>
              </td>
              <td>{player?.scores}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default Leaderboard;
