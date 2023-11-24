import "./App.css";
import Canvas from "./Canvas";
import { useEffect } from "react";
import SkribblePage from "./SkribbleGame/SkribblePage.jsx";
import Login from "./authPages/LoginPage/login.jsx";
import Register from "./authPages/RegisterPage/register";
import { Routes, Route } from "react-router-dom";
import ResetPasswordPage from "./authPages/ResetPasswordPage";
import EmailConfirmationPage from "./authPages/EmailConfirmationPage.js";
import Dashboard from "../src/DashBoard/Dashboard";
import PlayOnline from "./CanvasSelectionBoard/CreateBox/PlayOnline.jsx";
import DrawingGallery from "./DrawingBoards/DrawingGallery.js";
import { useUserAndChats } from "./Context/userAndChatsProvider.jsx";

function App() {
  const {Socket} = useUserAndChats();
  const socket = Socket.current;
  useEffect(()=>{
    socket?.on("join-invitation",(data)=>{
      console.log("Join Invitation")
      console.log(data)
    })
  },[socket])
  
  return (
    <Routes>
      <Route exact path="/canvas" Component={Canvas} />
      <Route exact path="/dashboard" Component={Dashboard} />
      <Route exact path="/" Component={Login} />
      <Route exact path="/register" Component={Register} />
      <Route exact path="/skribble" Component={SkribblePage} />
      <Route exact path="/verify-email" Component={EmailConfirmationPage} />
      <Route exact path="/reset-password" Component={ResetPasswordPage} />
      <Route exact path="/playOnline" Component={PlayOnline} />
      <Route exact path="/drawingGallery" Component={DrawingGallery} />
    </Routes>
  );
}

export default App;
