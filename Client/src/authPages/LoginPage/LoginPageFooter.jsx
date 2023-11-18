import React from "react";
import CustomPrimaryButton from "../../shared/Components/customPrimaryButton";
import RedirectInfo from "../../shared/Components/RedirectInfo";
import { useNavigate } from "react-router-dom";
import { Tooltip, CircularProgress } from "@mui/material";
import googleLogo from "../../Assets/Images/google.png";
import "./login.css";
import ErrorToast from "../../shared/Components/ErrorToast";

const getFormNotValidMessage = () => {
  return "Enter correct e-mail address and password should contains between 6 and 12 characters";
};

const getFormValidMessage = () => {
  return "Press to log in!";
};

const LoginPageFooter = ({
  handleLogin,
  isFormValid,
  showProgressBar,
  error,
  setError
}) => {
  const navigate = useNavigate();

  const handlePushToRegisterPage = () => {
    navigate("/register");
  };

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    try {
      window.open("http://localhost:8000/auth/google", "_self");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Tooltip
        title={!isFormValid ? getFormNotValidMessage() : getFormValidMessage()}
      >
        <div>
         { showProgressBar ? <CircularProgress /> :
          <CustomPrimaryButton
            label="Log in"
            additionalStyles={{ marginTop: "30px" }}
            disabled={!isFormValid}
            onClick={handleLogin}
          />}
        </div>
      </Tooltip>
      <RedirectInfo
        text="Need an account? "
        redirectText="Create an account"
        additionalStyles={{ marginTop: "5px" }}
        redirectHandler={handlePushToRegisterPage}
      />
      <div>
        <span>OR</span>
      </div>
      <div className="google-sign-in-container">
        <img
          src={googleLogo}
          onClick={handleGoogleLogin}
          alt="Sign in with Google"
          className="google-logo"
        />
      </div>
      {error && <ErrorToast message={error} setError= {setError} />}
    </>
  );
};

export default LoginPageFooter;
