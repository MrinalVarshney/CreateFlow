import React, { useEffect } from "react";
import CreateCanvas from "./CreateBox/CreateCanvas";
import "../Assets/Styles/styles.css";
import HostorJoin from "./CreateBox/HostorJoin";
import { useUserAndChats } from "../Context/userAndChatsProvider";

const SelectionBoard = () => {
  return (
    <div className="backGround" style={{ height: "100vh" }}>
      <CreateCanvas />
      <HostorJoin />
    </div>
  );
};

export default SelectionBoard;
