import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import PreMadeDrawingCard from "./Components/PreMadeDrawingCard";
import AddnewCard from "./Components/AddnewCard";
import { Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as api from "../api";
import ErrorToast from "../shared/Components/ErrorToast";
import CustomBackdrop from "../shared/Components/CustomBackDrop";
import { useUserAndChats } from "../Context/userAndChatsProvider";
import SuccessToast from "../shared/Components/successToast";
import backgroundGallary from "./Components/backgroundImage.jpg";

const DrawingGallery = () => {
  const navigate = useNavigate();
  const [showProgress, setShowProgress] = useState(false);
  const [drawingBoards, setDrawingBoards] = useState([{}]);
  const [favourites, setFavourites] = useState([{}]);
  const { setCanvasDetails } = useUserAndChats();
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getAllCanvas() {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user._id;
      setShowProgress(true);
      const response = await api.getAllCanvas(userId);
      if (response.error) {
        setError(response.errorMessage);
      } else {
        console.log("Drawing boards", response.data);
        setDrawingBoards(response.data.createdCanvases);
        setFavourites(response.data.favourites);
      }
      setShowProgress(false);
    }
    getAllCanvas();
  }, []);

  function onAddClick() {
    localStorage.removeItem("snapShot");
    navigate("/canvas");
  }

  const OpenSelectedCanvas = (details) => {
    const canvasData = details.canvasData;
    localStorage.setItem("snapShot", canvasData);
    setCanvasDetails(details);
    navigate("/canvas");
  };

  return (
        <div style={{width:"100%", height:"100vh",        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",backgroundImage: `url(https://img.freepik.com/free-vector/rectangle-frame-yellow-background-template_53876-112298.jpg?w=1060&t=st=1701493951~exp=1701494551~hmac=9fabbc25a1750d8e894b4a94cadcdba0b667d6acdc71c89434379013d83cf33b)`}}>
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100wh",
        height: "100vh",
      }}
    >
      {showProgress ? (
        <CustomBackdrop showProgress={showProgress} />
      ) : (
        <>
          <AddnewCard onAddClick={onAddClick} />
          <Grid container spacing={2} justifyContent="center">
            {drawingBoards.map((drawing) => {
              var inFavourites = favourites.find(
                (favourite) => favourite._id === drawing._id
              );
              return (
                <Grid item key={drawing._id}>
                  <PreMadeDrawingCard
                    details={drawing}
                    OpenSelectedCanvas={OpenSelectedCanvas}
                    setError={setError}
                    setSuccess={setSuccess}
                    isInFavourites={!!inFavourites} // Pass a boolean prop based on inFavourites
                  />
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
      {error && <ErrorToast message={error} setError={setError} />}
      {success && <SuccessToast message={success} setSuccess={setSuccess} />}
      <Button
        onClick={() => navigate("/dashboard")}
        style={{
          top: "88%",
          left: "84%",
          width: "fit-content",
          padding: "0.5%",
          backgroundColor: "rgb(66 157 196)",
          color: "white",
        }}
      >
        Go to DashBoard
      </Button>
    </Container>
    </div>
  );
};

export default DrawingGallery;
