import axios from "axios";
import {getToken, setToken} from './auth.js'
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
        setToken(token, decodedUser.sub);
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

export const ping = async () => {
    try {
        const response = await api.get("/ping");
        if(response.status == 204){
            console.log("Backend is up and running");
        }    
        } catch (error) {
            console.error("Backend server failed to start: ", error)
            throw error;
    }
}