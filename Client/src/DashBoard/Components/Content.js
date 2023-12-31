import React, { useState } from "react";
import "./Content.css";
import { useNavigate } from "react-router-dom";
import AppGif from "../../Assets/GIF/App.gif";
import AppImg from "../../Assets/Images/App.jpg";
import Navbar from "./Navbar";
import RulesCurser from "./RulesCurser";
import CustomBackdrop from "../../shared/Components/CustomBackDrop";

const YourComponent = ({notifications}) => {
  const [playedOnce, setPlayedOnce] = useState(false);
  const [progress,setProgress] = useState(false)
  const handleLoad = () => {
    setTimeout(() => {
      if (!playedOnce) setPlayedOnce(true);
    }, [4000]);
  };
  const navigate = useNavigate();
  const GotoGamePage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setProgress(true);
    setTimeout(()=>{
      navigate("/PlayOnline");
      setProgress(false)
    },2000)
  };

  const GoToGallery = ()=>{
    navigate("/drawingGallery")
  }

  return (
    progress? <CustomBackdrop showProgress={progress}/> :
    <div className="Inner-container">
      <div className="left-container">
        <div class="top-box">
          {playedOnce ? (
            <img
              src={AppImg}
              alt="App logo"
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <img
              src={AppGif}
              alt="app-gif"
              onLoad={handleLoad}
              style={{ width: "100%", height: "100%" }}
            />
          )}
        </div>

        <div class="middle-box">
          <div className="box sideBoxes">
            <div className="playText" onClick={GotoGamePage}>
              Play Skribble
            </div>
          </div>
        </div>

        <div class="bottom-box">
          <div className="box sideBoxes">
            <div className="playText" onClick={GoToGallery}>Drawing Boards</div>
          </div>
        </div>
      </div>

      <div className="right-container">
      <Navbar notifications={notifications}/>
      <div className="welcome-page">
        <h2 className="welcome-title">Welcome, Doodlers!</h2>
        <p className="welcome-text">
          Get ready to unleash your creativity. Here's a quick guide to get
          started:
        </p>
        <RulesCurser />
        </div>
      </div>
    </div>
  );
};

export default YourComponent;
