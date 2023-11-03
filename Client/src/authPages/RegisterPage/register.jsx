import React, { useState, useEffect } from "react";
import RegisterPageInput from "./RegisterPageInput";
import RegisterPageFooter from "./RegisterPageFooter";
import { validateRegistrationForm } from "../../shared/utils/FomValidator";
import AuthBox from "../../shared/Components/AuthBox";
import {useNavigate} from 'react-router-dom'
import {register} from "../../Actions/authActions"

const Register = () => {
  const [username, setUsername] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate()

  const handleRegister = ()=>{
    const userDetails = {
        username,
        mail,
        password
    }
    register(userDetails,navigate)
   
  }

  useEffect(() => {
    console.log(username)
    console.log(isFormValid)
    setIsFormValid(validateRegistrationForm({ username, mail, password }));
  }, [isFormValid,mail,username,password]);

  return (
    <AuthBox>
      <RegisterPageInput
        mail={mail}
        setMail={setMail}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
      />
      <RegisterPageFooter isFormValid={isFormValid} handleRegister={handleRegister}/>
    </AuthBox>
  );
};

export default Register;
