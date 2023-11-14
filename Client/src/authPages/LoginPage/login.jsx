import React, { useEffect, useState } from "react";
import AuthBox from "../../shared/Components/AuthBox";
import LoginInputs from "./LoginInputs";
import LoginPageFooter from "./LoginPageFooter";
import { validateLoginForm } from "../../shared/utils/FomValidator";
import { useNavigate } from "react-router-dom";
import { login } from "../../Actions/authActions";
import { useUserAndChats } from "../../Context/userAndChatsProvider";
import LoginHeader from "./LoginHeader";
import { Container } from "@mui/material";
import backgroundImage from "../../Assets/Images/backgroundImage.jpg";

const Login = () => {
  const { connectWithSocketServer } = useUserAndChats();

  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    login({ mail, password }, navigate, connectWithSocketServer);
  };

  useEffect(() => {
    setIsFormValid(validateLoginForm({ mail, password }));
  }, [mail, password]);

  return (
    <div style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center', 
      width: '100%',
      height: '100vh', 
    }}>
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <AuthBox>
          <LoginHeader />
          <LoginInputs
            mail={mail}
            setMail={setMail}
            password={password}
            setPassword={setPassword}
          />
          <LoginPageFooter
            isFormValid={isFormValid}
            handleLogin={handleLogin}
          />
        </AuthBox>
      </Container>
    </div>
  );
};

export default Login;
