import Lottie from "react-lottie";
import animationData from "./Animations/trophy.json"; // Replace with the path to your Lottie animation JSON file

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPaintBrush } from '@fortawesome/free-solid-svg-icons';

import React, { useState } from "react";
import "./LeaderBoard.css"; // Import the updated LeaderboardBox styles

function Leaderboard() {
  const [players, setPlayers] = useState([
    { name: "Player 1", score: 100 },
    { name: "Player 2", score: 110 },
    { name: "Player 3", score: 90 },
    // Add more players and scores as needed
  ]);

  const defaultOptions = {
    loop: true, // Set to true if you want the animation to loop
    autoplay: true, // Set to true to start the animation automatically
    animationData: animationData, // The animation data imported above
  };

  // Sort players by score in descending order
  players.sort((a, b) => b.score - a.score);

  function getMaxScore(players) {
    let maxScore = -1; // Initialize with a value lower than any possible score

    for (const player of players) {
      if (player.score > maxScore) {
        maxScore = player.score;
      }
    }

    return maxScore;
  }

  const maxScore = getMaxScore(players);

  return (
    <div className="leaderboard-box">
      <div className="header">
        <Lottie options={defaultOptions} height={100} width={100} />
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
          {players.map((player, index) => (
            <tr key={index}>
              <td>
                <div className="user-profile">
                  <img
                    src=/*{player.profilePic}*/ "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                    alt={player.name}
                    width="50"
                    height="50"
                  />
                  {player.name}
                  <div
                    className="score-line"
                    style={{
                      width: `${((player.score + 1) / maxScore) * 200}px`,
                    }}
                  ></div>
                </div>
              </td>
              <td>{player.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
