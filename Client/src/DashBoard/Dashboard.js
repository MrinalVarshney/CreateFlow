import React, { useEffect, useState } from "react";
import ParticleJsBackground from "./Components/ParticleJsBackground";
import Content from "./Components/Content";
import { getCookie } from "../shared/utils/getCookie";
import CustomBackdrop from "../shared/Components/CustomBackDrop";
import "./DashBoard.css";
import * as api from "../api";
import { useUserAndChats} from "../Context/userAndChatsProvider";


const Dashboard = () => {
  useEffect(() => {
    const user= JSON.parse(localStorage.getItem("user"))
    const token = getCookie("token");
    if (!user && token) {
      const username = getCookie("username");
      const email = getCookie("email");
      const pic = getCookie("pic");
      const verified = getCookie("verified");
      const data = {username,email,pic,token,verified}
      localStorage.setItem("user",JSON.stringify(data))
    }
  }, []);
  const { setUser,connectWithSocketServer } = useUserAndChats();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);


  useEffect(() => {
    connectWithSocketServer()
    const getInvitations = async () => {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"))
      setUser(user)
      const userId = user?._id;
      const response = await api.getPendingInvitations(userId);
      setLoading(false);
      if (response.error) {
        console.log(response.errorMessage);
      } else {
        setNotifications(response.data);
      }
    };
    getInvitations();
  }, []);


  return (
    loading ? <CustomBackdrop showProgress={loading} /> :
    <div className="container">
      <Content notifications={notifications}/>
      <ParticleJsBackground />
    </div>
  );
};

export default Dashboard;
