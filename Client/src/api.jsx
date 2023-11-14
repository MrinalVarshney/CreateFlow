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
      return await apiClient.post("/api/user/login", data);
    } catch (error) {
      return {
        error: true,
        errorMessage: error.response.data,
      };
    }
  };

export const registerUser = async(data)=>{
    try{
        return await apiClient.post("/api/user/register",data)
    }
    catch(error){
        return {
            error:true,
            errorMessage:error.response.data
        }
    }
}


export const RecoverPassword = async (mail) => {
  try {
    return await apiClient.post("/api/user/recover", {mail:mail});
  } catch (error) {
    return {
      error: true,
      errorMessage: error.response.data,
    };
  }
}

export const checkExpiry = async (token) => {
  try {
    const params = {
      token:token
    }
    return await apiClient.get("/api/user/check-expiry", {params:params});
  } catch (error) {
    return {
      error: true,
      errorMessage: error.response.data,
    };
  }
}

export const resetPassword = async (token, password) => {
  try {
    return await apiClient.post("/api/user/reset-password", {token:token,password:password});
  } catch (error) {
    return {
      error: true,
      errorMessage: error.response.data,
    };
  }
}

export const sendVerificationMail = async (user) => {
  try {
    return await apiClient.post("/api/user/send-verification-mail", user);
  } catch (error) {
    return {
      error: true,
      errorMessage: error.response.data,
    };
  }
}

export const markAsVerified = async (token) => {
  try {
    const params = {
      token:token
    }
    return await apiClient.get("/api/user/verify-email", {params:params});
  } catch (error) {
    return {
      error: true,
      errorMessage: error.response.data,
    };
  }
}
