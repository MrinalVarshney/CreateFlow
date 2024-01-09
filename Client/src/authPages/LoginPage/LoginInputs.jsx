import React, { useState, useRef } from "react";
import InputWithLabel from "../../shared/Components/InputWithLabel";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { RecoverPassword } from "../../Actions/authActions";
import { validateMail } from "../../shared/utils/FomValidator";
import ErrorToast from "../../shared/Components/ErrorToast";

const LoginInputs = ({ mail, setMail, password, setPassword }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [showProgressBar, setshowProgressBar] = useState(false); // for progress bar
  const [error, setError] = useState(null);
  const userMail = useRef(null);

  function handleForgotPassword() {
    setIsModalOpen(true);
  }

  const handlePasswordRecovery = async (e) => {
    console.log(recoveryEmail);
    e.preventDefault();
    if (!validateMail(recoveryEmail)) {
      setIsModalOpen(false);
      setError("Enter correct e-mail address");
      return;
    }
    setshowProgressBar(true);
    const response = await RecoverPassword(recoveryEmail);
    console.log("response", response);
    if (response.error) {
      console.log(response.errorMessage);
      setIsModalOpen(false);
      setshowProgressBar(false);
      setError(response.errorMessage);
    } else {
      if (!response.data.verified) {
        setIsModalOpen(false);
        setError("Your account is not verified");
        setshowProgressBar(false);
        return;
      }
      setIsVerified(response.data.verified);
      userMail.current = response.data.email;
      console.log("response ", response);
    }
    setRecoveryEmail("");
  };

  const resendMail = async (e) => {
    e.preventDefault();
    const response = await RecoverPassword(userMail.current);
    if (response.error) {
      setError(response.errorMessage);
      setIsModalOpen(false);
    } else {
      setIsVerified(true);
    }
  };

  return (
    <>
      <InputWithLabel
        value={mail}
        setValue={setMail}
        label="E-mail"
        type="text"
        placeholder="Enter e-mail address"
      />
      <InputWithLabel
        value={password}
        setValue={setPassword}
        label="Password"
        type="password"
        placeholder="Enter password"
      />
      <div style={{ width: "100%", alignItems: "left" }}>
        <p
          style={{
            display: "inline-block",
            left: "5",
            cursor: "pointer",
            color: "blue",
          }}
          onClick={handleForgotPassword}
        >
          Forgot Password?
        </p>
      </div>
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {isVerified === true ? (
          <>
            <DialogTitle>Password Recovery</DialogTitle>
            <DialogContent>
              <p>
                We have sent you a link to reset your password at{" "}
                {userMail.current}. Please check your e-mail.
              </p>
            </DialogContent>
            <DialogActions>
              <Button onClick={resendMail} variant="contained" color="primary">
                Resend Mail
              </Button>
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="contained"
                color="primary"
              >
                Close
              </Button>
            </DialogActions>
          </>
        ) : showProgressBar ? (
          <DialogContent
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h2>Verifying Email...</h2>
            <CircularProgress />
          </DialogContent>
        ) : (
          <>
            <DialogTitle>Password Recovery</DialogTitle>
            <DialogContent>
              <p>
                Enter your e-mail address and we will send you a link to reset
                your password
              </p>
              <InputWithLabel
                value={recoveryEmail}
                setValue={setRecoveryEmail}
                label="E-mail"
                type="text"
                placeholder="Enter your e-mail address"
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handlePasswordRecovery}
                variant="contained"
                color="primary"
              >
                Recover Password
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      {error && <ErrorToast message={error} setError={setError} />}
    </>
  );
};

export default LoginInputs;
