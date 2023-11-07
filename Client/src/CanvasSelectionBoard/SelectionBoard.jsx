import React, { useEffect } from "react";
import CreateCanvas from "./CreateBox/CreateCanvas";
import "../Assets/Styles/styles.css";
import HostorJoin from "./CreateBox/HostorJoin";
import { useUserAndChats } from "../Context/userAndChatsProvider";

const SelectionBoard = () => {
  const {connectWithSocketServer} = useUserAndChats()

  useEffect(() => {
    connectWithSocketServer()
  }, []);
  return (
    <div className="backGround" style={{ height: "100vh" }}>
      <CreateCanvas />
      <HostorJoin />
    </div>
  );
};

export default SelectionBoard;
