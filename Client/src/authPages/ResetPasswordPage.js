import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import ErrorToast from "../shared/Components/ErrorToast";
import { useSearchParams } from "react-router-dom";
import { checkExpiry, resetPassword } from "../Actions/authActions";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [invalidAccess, setInvalidAccess] = useState(false);
  const [displayPage, setDisplayPage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [progressBar, setshowProgressBar] = useState(false);
  const token = searchParams.get("token");

  useEffect(() => {
    const validationCheck = async () => {
      const response = await checkExpiry(token);
      setDisplayPage(true);
      if (response.error) {
        setInvalidAccess(true);
        setError(response.errorMessage);
      }
    };
    validationCheck();
  }, [token]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setshowProgressBar(true);
    const response = await resetPassword(token, password);
    if (response.error) {
      setError(response.errorMessage);
    } else {
      setSuccessMessage("Password reset successfully");
    }
    setshowProgressBar(false);
  };

  return displayPage ? (
    invalidAccess ? (
      <Container sx={{backgroundColor:"rgba(255, 215, 0, 0.8)"}}>
      <Paper elevation={4} sx={{ padding: 4, display:"flex", flexDirection:"row",justifyContent:"center",alignItems:"center",height:"70vh" }}>
      <h1>{error}</h1>
      </Paper>
      </Container>
    ) : (
      <Container component="main" maxWidth="md">
        {" "}
        {/* Adjusted maxWidth */}
        <Paper
          elevation={3}
          sx={{
            display: "flex",
            flexDirection: "row",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {/* Left-side vertical yellow column with sine wave pattern */}
          <div
            style={{
              backgroundColor: "rgba(255, 215, 0, 0.8)",
              flexBasis: "30%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 80%)",
            }}
          >
            <Typography variant="h4" color="textPrimary">
              CreateFlow
            </Typography>
          </div>

          {/* Right-side content */}

          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ flexBasis: "70%", padding: 4 }}
          >
            {successMessage ? (
              <Typography component="h1" variant="h5" mb={2}>
                {successMessage}
              </Typography>
            ) : (
              <>
                <Typography component="h1" variant="h5" mb={2}>
                  {" "}
                  {/* Reduced margin-bottom */}
                  Reset Password
                </Typography>
                {progressBar ? (
                  
                  <CircularProgress sx={{marginLeft:5}}/>
                ) : (
                  <form style={{ width: "100%" }}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="New Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={handleResetPassword}
                      style={{ marginTop: 2 }}
                    >
                      Reset Password
                    </Button>
                  </form>
                )}
              </>
            )}
          </Grid>
        </Paper>
        {error && <ErrorToast message={error} setError={setError} />}
      </Container>
    )
  ) : (
    <Backdrop />
  );
};

export default ResetPasswordPage;
