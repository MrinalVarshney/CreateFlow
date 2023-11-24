// DrawingCard.js
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Container,
} from "@mui/material";
import "./Cards.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useUserAndChats } from "../../Context/userAndChatsProvider";
import * as api from "../../api";
import {CircularProgress} from "@mui/material"

const DrawingCard = ({
  details,
  OpenSelectedCanvas,
  setError,
  setSuccess,
  isInFavourites,
}) => {
  
  const [isTextVisible, setIsTextVisible] = useState(false);
  const { user } = useUserAndChats();
  const [inFavourites, setinFavourites] = useState(Boolean(isInFavourites));
  const [updating, setUpdating] = useState(false);

  const imageUrl = details.canvasData;
  const canvasName = details.canvasName;
  const canvasId = details._id;

  const handleMouseEnter = () => {
    setIsTextVisible(true);
  };

  const handleMouseLeave = () => {
    setIsTextVisible(false);
  };

  const addToFavourites = async () => {
    const userId = user?._id;
    console.log("add in favourites")
    setUpdating(true)
    const response = await api.addToFavourites(canvasId,userId);
    setUpdating(false);
    console.log("added")
    if(response.error){
      setError(response.errorMessage);
    }
    else{
      setSuccess("Added to favourites");
    }
    setinFavourites(true);
  };

  const removeFromfavourites =async () => {
    const userId = user?._id;
    setUpdating(true)
    console.log("removing from favourites")
    const response = await api.removeFromFavourites(canvasId,userId);
    setUpdating(false);
    if(response.error){
      setError(response.errorMessage);
    }
    else{
      setSuccess("Removed from favourites");
    }
    setinFavourites(false);
  };

  return (
    <Card
      sx={{ maxWidth: 300, borderRadius: 5, boxShadow: 4, margin: 2 }}
      className="preMadeCard"
    >
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="cardContainer"
        onClick={() => OpenSelectedCanvas(details)}
      >
        <CardMedia
          component="img"
          height="200"
          image={imageUrl}
          alt="Drawing Preview"
          className="cardMedia"
        />
        {isTextVisible && (
          <div className="hoverText">
            <OpenInNewIcon />
          </div>
        )}
      </div>
      <CardContent
        sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}
      >
        <Typography variant="h6" gutterBottom>
          {canvasName}
        </Typography>
        <Container
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            gap: "16px",
            alignItems: "center",
          }}
        >
        {updating ? <CircularProgress /> :
          inFavourites ? (
            <FavoriteIcon
              sx={{ color: "rgb(203, 66, 3)" }}
              onClick={removeFromfavourites}
              className="favouriteIcon"
            />
          ) : (
            <FavoriteBorderIcon
              sx={{ color: "rgb(203, 66, 3)" }}
              onClick={addToFavourites}
              className="favouriteIcon"
            />
          )}
          <Button variant="outlined" color="primary">
            Collaborators
          </Button>
        </Container>
      </CardContent>
    </Card>
  );
};

export default DrawingCard;
