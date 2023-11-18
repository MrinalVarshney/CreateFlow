import {userLogout} from "../../Actions/authActions.jsx"
export const logout = async(userId)=>{
    await userLogout(userId);
    localStorage.clear();
}