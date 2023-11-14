import * as api from "../api";

export const register = async (user, navigate) => {
  const response = await api.registerUser(user);
  console.log(response);
  if (response.error) {
    console.log(response.errorMessage);
  } else {
    const userDetails = response.data;
    console.log(userDetails);
    localStorage.setItem("user", JSON.stringify(userDetails));
    navigate("/dashboard");
  }
};

export const login = async (user, navigate) => {
  console.log("loginauth");
  const response = await api.login(user);
  if (response.error) {
    console.log(response.errorMessage);
  } else {
    const userDetails = response.data;
    console.log(userDetails);
    localStorage.setItem("user", JSON.stringify(userDetails));
    navigate("/dashboard");
  }
};

export const sendVerificationMail = async(user) => {
  const response = await api.sendVerificationMail(user);
  return response;
}

export const markAsVerified = async (token) => {
  const response = await api.markAsVerified(token);
  console.log(response)
  return response;
}

export const RecoverPassword = async (mail) => {
  const response = await api.RecoverPassword(mail);
  return response;
}

export const checkExpiry = async (token) => {
  const response = await api.checkExpiry(token);
  return response;
}

export const resetPassword = async (token,password) => {
  const response = await api.resetPassword(token,password); 
  return response;
}