import React from "react";
import { Paper, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  boxContainer: {
    width: 200,
    height: 200,
    marginTop: 10,
    position: "absolute",
    marginLeft: 250,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s",
    border: "2px solid #black",
    borderRadius: "20px",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: "0px 0px 10px 3px #888",
    },
  },
  modal: {
    width: "auto",
    height: "auto",
    maxWidth: "40%",
    minHeight: "300px",
    margin: "7% 30%",
  },
  insideModal: {
    width: 150,
    height: 150,
    margin: "30px 50px",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s",
    border: "2px solid #black",
    borderRadius: "20px",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: "0px 0px 10px 3px #888",
    },
  },
});

function PlayOnline() {
  const navigate = useNavigate();
  const classes = useStyles();
  const handleClick = () => {
    console.log("clicked");
    navigate("/selectionBoard/playOnline");
  };

  return (
    <div>
      <Paper className={classes.boxContainer}>
        <Button onClick={handleClick}>Play Online</Button>
      </Paper>
    </div>
  );
}

export default PlayOnline;
