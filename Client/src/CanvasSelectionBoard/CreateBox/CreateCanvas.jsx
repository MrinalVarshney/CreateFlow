import React from "react";
import { Paper, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import AddIcon from "@mui/icons-material/Add";

const useStyles = makeStyles({
  boxContainer: {
    width: 200,
    height: 200,
    margin: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s",
    border: "2px solid #black",
    borderRadius: "20px",
    position: "absolute",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: "0px 0px 10px 3px #888",
    },
  },
});

// const createNewCanvas = () =>{
//   const roomData = {
//     canvasName: "New Canvas",
//     userId: "1234"
//   };
//   createNewRoom(roomData)
// }

function CreateCanvas({ onBoxClick }) {
  const classes = useStyles();

  return (
    <Paper className={classes.boxContainer} onClick={onBoxClick}>
      <Button>
        <AddIcon style={{ height: 50, width: 50 }} />
      </Button>
      New
    </Paper>
  );
}

export default CreateCanvas;
