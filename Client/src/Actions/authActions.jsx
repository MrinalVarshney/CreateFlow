import * as api from "../api";

export const register = async (user, navigate) => {
    console.log(user)
  const response = await api.registerUser(user);
  if (response.error) {
    console.log(response.errorMessage);
  } else {
    const {userDetails} = response.data;
    localStorage.setItem("user", JSON.stringify(userDetails));
    navigate("/selectionBoard");
  }
};

export const login = async (user, navigate) => {
    const response = await api.login(user);
    if (response.error) {
        console.log(response.errorMessage);
    } else {
        const {userDetails} = response.data;
        localStorage.setItem("user", JSON.stringify(userDetails));
        navigate("/selectionBoard");
    }
    }


