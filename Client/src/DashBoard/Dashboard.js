import React from "react";
import ParticleJsBackground from "./Components/ParticleJsBackground";
import Content from "./Components/Content"
import { getCookie } from "../shared/utils/getCookie";
import "./DashBoard.css";
import Navbar from "./Components/Navbar";

const Dashboard = () => {

  // useEffect(() => {
  //   const token = getCookie("token");

  //   if (token) {
  //     const username = getCookie("username");
  //     const email = getCookie("email");
  //     const pic = getCookie("pic");
  //     const verified = getCookie("verified");
  //     const data = {username,email,pic,token,verified}
  //     localStorage.setItem("user",JSON.stringify(data))
  //   }
  // }, []);

  return (
    <div className="container" >
      <Content />
      <ParticleJsBackground />
    </div>
  );
};

export default Dashboard;
