import './App.css';
import Canvas from './Canvas';
import SelectionBoard from './CanvasSelectionBoard/SelectionBoard';
import Login from './authPages/LoginPage/login.jsx';
import Register from './authPages/RegisterPage/register';
import {Routes, Route} from "react-router-dom"

function App() {
  return (
    <Routes>
      <Route exact path="/canvas" Component={Canvas} />
      <Route exact path="/selectionBoard" Component={SelectionBoard} />
      <Route exact path="/login" Component={Login} />
      <Route exact path="/register" Component={Register} />
    </Routes>
  );
}

export default App;
