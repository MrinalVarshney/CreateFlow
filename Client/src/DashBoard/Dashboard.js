import React from "react";
import ParticleJsBackground from "./Components/ParticleJsBackground";
import Content from "./Components/Content"
import { getCookie } from "../shared/utils/getCookie";
import "./DashBoard.css";
import Navbar from "./Components/Navbar";

const Dashboard = () => {


  return (
    <div className="container" >
      <Content />
      <ParticleJsBackground />
    </div>
  );
};

export default Dashboard;
