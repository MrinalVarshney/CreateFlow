import * as api from "../api";

export const register = async (user, navigate) => {
  const response = await api.registerUser(user);
  console.log(response)
  if (response.error) {
    console.log(response.errorMessage);
  } else {
    const userDetails = response.data;
    console.log(userDetails)
    localStorage.setItem("user", JSON.stringify(userDetails));
    navigate("/selectionBoard");
  }
};

export const login = async (user, navigate) => {
    const response = await api.login(user);
    if (response.error) {
        console.log(response.errorMessage);
    } else {
        const userDetails = response.data;
        localStorage.setItem("user", JSON.stringify(userDetails));
        navigate("/selectionBoard");
    }
  }


