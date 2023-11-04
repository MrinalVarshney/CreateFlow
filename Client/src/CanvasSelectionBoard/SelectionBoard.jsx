import React, { useEffect } from "react";
import CreateCanvas from "./CreateBox/CreateCanvas";
import "../Assets/Styles/styles.css";
import { connectWithSocketServer } from "../RealTimeCommunication/socketConnection";
// import { useUser } from '../Context/userAndChatsProvider'
import HostorJoin from "./CreateBox/HostorJoin";

const SelectionBoard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    console.log("Hii", user);
    connectWithSocketServer(user);
  }, []);

  return (
    <div className="backGround" style={{ height: "100vh" }}>
      <CreateCanvas />
      <HostorJoin />
    </div>
  );
};

export default SelectionBoard;
