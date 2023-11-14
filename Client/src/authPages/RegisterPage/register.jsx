import React, { useState, useEffect, useRef } from "react";
import RegisterPageInput from "./RegisterPageInput";
import RegisterPageFooter from "./RegisterPageFooter";
import { validateRegistrationForm } from "../../shared/utils/FomValidator";
import AuthBox from "../../shared/Components/AuthBox";
import { sendVerificationMail } from "../../Actions/authActions";
import { Container } from "@mui/material";
import RegisterHeader from "./RegisterPageHeader";
import backgroundImage from "../../Assets/Images/backgroundImage.jpg";
import ErrorToast from "../../shared/Components/ErrorToast";
import { CircularProgress } from "@mui/material";

const Register = () => {
  const [username, setUsername] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState(null);
  const [showVerifyMessage, setShowVerifyMessage] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const userMail = useRef(null);

  const handleRegister = async () => {
    const userDetails = {
      username,
      mail,
      password,
    };
    setShowProgressBar(true);
    const response = await sendVerificationMail(userDetails);
    setUsername("");
    userMail.current = mail;
    setMail("");
    setPassword("");
    setShowProgressBar(false);
    if (response.error) {
      setError(response.errorMessage);
      return;
    }
    
    setShowVerifyMessage(true);
  };

  useEffect(() => {
    console.log(username);
    console.log(isFormValid);
    setIsFormValid(validateRegistrationForm({ username, mail, password }));
  }, [isFormValid, mail, username, password]);

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        width: "100%",
        height: "100vh",
      }}
    >
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <AuthBox>
          {showVerifyMessage ? (
            <p>
              A verification link is sent at email: {userMail.current}. Please
              verify your email to continue.
            </p>
          ) : (
            <>
              <RegisterHeader />
              <RegisterPageInput
                mail={mail}
                setMail={setMail}
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
              />
              {showProgressBar ? (
                <CircularProgress />
              ) : (
                <RegisterPageFooter
                  isFormValid={isFormValid}
                  handleRegister={handleRegister}
                />
              )}
            </>
          )}
        </AuthBox>
      </Container>
      {error && <ErrorToast message={error} setError={setError} />}
    </div>
  );
};

export default Register;
