import axios from "axios";
import {getToken} from './auth.js'
import {jwtDecode} from 'jwt-decode'

const api = axios.create({
    baseURL : import.meta.env.VITE_BACKEND_HTTP_URL
});

api.interceptors.request.use((config) =>{
    const token =  getToken();
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})


export const signup = async (user) => {
    try{
        const response = await api.post("/auth/register", user);
        return response.data;
    }catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            console.error("Registration failed : ", error)
            throw error;
        }
    }
};

export const signin = async (user) => {
    try{
        const response = await api.post("/auth/login", user);
        const token = response.data.token
        const decodedUser = jwtDecode(token)
        localStorage.setItem("username", decodedUser.sub)
        localStorage.setItem("jwtToken", token)
        return response.data;
    }catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data);
        }
        else{
            console.error("Sign in failed : ", error)
            throw error;
        }
    }
};