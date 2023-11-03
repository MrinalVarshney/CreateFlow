import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 100000,
});

apiClient.interceptors.request.use(
  (config) => {
    const userDetails = localStorage.getItem("user");

    if (userDetails) {
      const token = JSON.parse(userDetails).token;
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export const login = async (data) => {
    try {
      return await apiClient.post("/auth/login", data);
    } catch (error) {
      return {
        error: true,
        errorMessage: error.response.data.message,
      };
    }
  };

export const registerUser = async(data)=>{
    try{
        return await apiClient.post("/auth/register",data)
    }
    catch(err){
        return {
            error:true,
            errorMessage:err.response.message
        }
    }
}
