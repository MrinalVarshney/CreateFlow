import React, { useEffect } from "react";
import ParticleJsBackground from "./ParticleJsBackground";
import { getCookie } from "../shared/utils/getCookie";

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
    <div>
      <ParticleJsBackground />
    </div>
  );
};

export default Dashboard;
