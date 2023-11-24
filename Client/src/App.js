import "./App.css";
import Canvas from "./Canvas";
import SkribblePage from "./SkribbleGame/SkribblePage.jsx";
import Login from "./authPages/LoginPage/login.jsx";
import Register from "./authPages/RegisterPage/register";
import { Routes, Route } from "react-router-dom";
import ResetPasswordPage from "./authPages/ResetPasswordPage";
import EmailConfirmationPage from "./authPages/EmailConfirmationPage.js";
import Dashboard from "../src/DashBoard/Dashboard";
import PlayOnline from "./CanvasSelectionBoard/CreateBox/PlayOnline.jsx";
import LeaderBoard from "./shared/Components/LeaderBoard.js";
import NetworkErrorPage from "./NetworkErrorPages/ErrorPage.js";
import NotFound from "./NetworkErrorPages/NotFoundPage.js";

function App() {
  return (
    <>

     {
        (window.navigator.onLine)===false ? <NetworkErrorPage/> :  
       
          

      <Routes>
      <Route exact path="/canvas" Component={Canvas} />
      <Route exact path="/dashboard" Component={Dashboard} />
      <Route exact path="/" Component={Login} />
      <Route exact path="/register" Component={Register} />
      <Route exact path="/skribble" Component={SkribblePage} />
      <Route exact path="/verify-email" Component={EmailConfirmationPage} />
      <Route exact path="/reset-password" Component={ResetPasswordPage} />
      <Route exact path="/playOnline" Component={PlayOnline} />
      <Route exact path="/leaderBoard" Component={LeaderBoard} />
      <Route exact path="/offline" Component={NetworkErrorPage} />
      <Route path="*" element={<NotFound />} />
    </Routes>
}

    </>

  );
}

export default App;
