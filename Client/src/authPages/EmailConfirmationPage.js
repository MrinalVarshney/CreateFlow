import React, { useState, useEffect } from "react";
import { Container, Paper, Backdrop } from "@mui/material";

import { useSearchParams } from "react-router-dom";
import { markAsVerified } from "../Actions/authActions";

const EmailConfirmationPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [error, setError] = useState(null);

  const token = searchParams.get("token");
  useEffect(() => {
    const markUserAsVerified = async () => {
      setShowProgressBar(true);
      const response = await markAsVerified(token);
      setShowProgressBar(false);
      if (response.error) {
        setError(response.errorMessage);
        return;
      }
      else{
        console.log(response.data)
        localStorage.setItem("user",JSON.stringify(response.data))
      }
    };
    markUserAsVerified();
  },[]);
  return showProgressBar ? (
    <Backdrop />
  ) : (
    <Container sx={{ backgroundColor: "rgba(255, 215, 0, 0.8)" }}>
      <Paper
        elevation={4}
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <h1>{error ? error : "Congratulations! You have been registered successfully"}</h1>
      </Paper>
    </Container>
  );
};

export default EmailConfirmationPage;
