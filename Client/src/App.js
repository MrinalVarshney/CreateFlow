import "./App.css";
import Canvas from "./Canvas";
import SkribblePage from "./SkribbleGame/SkribblePage.jsx";
// import Skribble from "../src/SkribbleGame/Components/skribble.jsx";
import SelectionBoard from "./CanvasSelectionBoard/SelectionBoard";
import Login from "./authPages/LoginPage/login.jsx";
import Register from "./authPages/RegisterPage/register";
import { Routes, Route } from "react-router-dom";
import ResetPasswordPage from "./authPages/ResetPasswordPage";
import EmailConfirmationPage from "./authPages/EmailConfirmationPage.js";
import Dashboard from "../src/DashBoard/Dashboard";
import PlayOnline from "./CanvasSelectionBoard/CreateBox/PlayOnline.jsx";

function App() {
  return (
    <Routes>
      <Route exact path="/canvas" Component={Canvas} />
      <Route exact path="/dashboard" Component={Dashboard} />
      <Route exact path="/selectionBoard" Component={SelectionBoard} />
      <Route exact path="/" Component={Login} />
      <Route exact path="/register" Component={Register} />
      <Route exact path="/skribble" Component={SkribblePage} />
      <Route exact path="/verify-email" Component={EmailConfirmationPage} />
      <Route exact path="/reset-password" Component={ResetPasswordPage} />
      <Route exact path="/selectionBoard/playOnline" Component={PlayOnline} />
    </Routes>
  );
}

export default App;
