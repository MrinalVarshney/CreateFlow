import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 100000,
});

// apiClient.interceptors.request.use(
//   (config) => {
//     const userDetails = localStorage.getItem("user");

//     if (userDetails) {
//       const token = JSON.parse(userDetails).token;
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (err) => {
//     return Promise.reject(err);
//   }
// );

export const login = async (data) => {
  try {
    return await apiClient.post("/api/auth/login", data);
  } catch (error) {
    console.log(error);
    return {
      error: true,
      errorMessage: error.response.data,
    };
  }
};

export const registerUser = async (data) => {
  try {
    return await apiClient.post("/api/auth/register", data);
  } catch (error) {
    return {
      error: true,
      errorMessage: error.response.data,
    };
  }
};

export const RecoverPassword = async (mail) => {
  try {
    return await apiClient.post("/api/auth/recover", { mail: mail });
  } catch (error) {
    return {
      error: true,
      errorMessage: error.response.data,
    };
  }
};

export const checkExpiry = async (token) => {
  try {
    const params = {
      token: token,
    };
    return await apiClient.get("/api/auth/check-expiry", { params: params });
  } catch (error) {
    return {
      error: true,
      errorMessage: error.response.data,
    };
  }
};

export const resetPassword = async (token, password) => {
  try {
    return await apiClient.post("/api/auth/reset-password", {
      token: token,
      password: password,
    });
  } catch (error) {
    return {
      error: true,
      errorMessage: error.response.data,
    };
  }
};

export const sendVerificationMail = async (user) => {
  try {
    return await apiClient.post("/api/auth/send-verification-mail", user);
  } catch (error) {
    return {
      error: true,
      errorMessage: error.response.data,
    };
  }
};

export const markAsVerified = async (token) => {
  try {
    const params = {
      token: token,
    };
    return await apiClient.get("/api/auth/verify-email", { params: params });
  } catch (error) {
    return {
      error: true,
      errorMessage: error.response.data,
    };
  }
};

export const userLogout = async (userId) => {
  try {
    const params = {
      userId: userId,
    };
    console.log(params);
    return await apiClient.get("/api/auth/logout", { params: params });
  } catch (error) {
    return {
      error: true,
      errorMessage: error.response.data,
    };
  }
};

export const getUsers = async (userName) => {
  const params = {
    userName: userName
  }
  try{
    return await apiClient.get("/api/user/searchUsers", {params: params});
  }
  catch(error){
    return {
      error: true,
      errorMessage: error.response.data,
    };
  }
}

export const getPendingInvitations = async (userId) => {
  try {
    const params = {userId:userId}
    return await apiClient.get("/api/user/getPendingInvitations",{params:params});
  } catch (error) {
    return {
      error: true,
      errorMessage: error.response.data,
    };
  }
}

export const addToFavourites = async (canvasId,userId) =>{
  const data= {canvasId,userId}
  try{
    return await apiClient.post("/api/user/favourites/add",data)
  }catch(error){
    return {
      error: true,
      message: error.response.data
    }
  }
}

export const removeFromFavourites = async (canvasId,userId) =>{
  console.log("CanvasId",canvasId)
  const params = {canvasId:canvasId, userId:userId}
  try{
    return await apiClient.delete(`/api/user/favourites/remove`,{params:params})
  }catch(error){
    return {
      error: true,
      message: error.response.data
    }
  }
}

export const getAllCanvas = async (userId) => {
  try {
    const params = { userId: userId };
    return await apiClient.get("/api/canvas/getAllCanvas", { params: params });
  } catch (error) {
    return {
      error: true,
      errorMessage: error.response.data,
    };
  }
};

export const saveCanvas = async (data) => {
  try {
    return await apiClient.post("/api/canvas/addNewCanvas", data);
  } catch (error) {
    return {
      error: true,
      errorMessage: error.response.data,
    };
  }
};

export const updateCanvas = async (updates)=>{
  try{
    return await apiClient.post("/api/canvas/resaveCanvas",updates);
  }catch(error){
    return {
      error: true,
      errorMessage: error.response.data
    }
  }
}

