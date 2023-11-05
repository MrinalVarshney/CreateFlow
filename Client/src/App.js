import "./App.css";
import Canvas from "./Canvas";
import Skribble from "./skribble";
import SelectionBoard from "./CanvasSelectionBoard/SelectionBoard";
import Login from "./authPages/LoginPage/login.jsx";
import Register from "./authPages/RegisterPage/register";
import Socket from "../src/RealTimeCommunication/socketConnection"
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route exact path="/canvas" Component={Canvas} />
      <Route exact path="/selectionBoard" Component={SelectionBoard} />
      <Route exact path="/" Component={Login} />
      <Route exact path="/register" Component={Register} />
      <Route exact path="/skribble" Component={Skribble} />
      <Route exact path="/check" Component={Socket} />
    </Routes>
  );
}

export default App;
