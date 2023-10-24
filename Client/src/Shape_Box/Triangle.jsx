import React from "react";
import ChangeHistoryRoundedIcon from "@mui/icons-material/ChangeHistoryRounded";
import "./Styles.css"

const Triangle = () => {
  const handleClick = () => {
    console.log("Triangle");
  };
  return (
    <div className="shapes">
      <ChangeHistoryRoundedIcon onClick={handleClick} />
    </div>
  );
};

export default Triangle;
