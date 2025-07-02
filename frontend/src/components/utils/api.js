import axios from "axios";
import {getToken, removeToken, setToken} from './auth.js'
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
        await fetch(`${import.meta.env.VITE_BACKEND_URL}`, {
            method: 'GET',
        });    
    } catch (error) {
        console.error("Backend server failed to start: ", error)
        throw error;
    }
}

export const verifyJwtToken  = async () => {
    if(getToken() == null){
        return false;
    }
    try {
        const response = await api.get("/auth/verifyJwtToken");
        if(response.status == 204){
            return true;
        }
        removeToken();
        return false;
    } catch (error) {
        removeToken();
        if(error.response && error.response.data){
            console.log(error.response.data);
            return false
        }
        else{
            console.error("Jwt verification failed : ", error)
            console.log(error);
            return false
        }
    }
}

export const getAllProjects = async () => {
    try {
        const response = await api.get("/projects")
        return response.data
    } catch (error) {
        throw new Error(error.response.data)
    }
}

export const addNewProject = async (projectName) => {
    try{
        const response = await api.post("/projects", {projectName : projectName})
        if(response.status == 201){
            return response.data
        }
        else{
            console.error("Error creating new project")
            throw new Error("No duplicate name")
        }
    }
    catch(error){
        console.error("Error creating new project")
        throw new Error(error.response.data)
    }
}

export const deleteProjectById = async (id) => {
    try {
        const response = await api.delete(`/projects/${id}`)
        if(response.status == 200)
            return;
        throw new Error("Error deleting project")    
    } catch (error) {
        throw new Error(error.response.data)
    }
}

export const getProjectById = async (id) => {
    try {
        const response = await api.get(`/projects/${id}`)
        return response.data
    } catch (error) {
        throw new Error(error.response.data)
    }
}

export const addCollaboratorApi = async (usernameOrEmail, projectId) => {
    try {
        const response = await api.post(`/collaborators`, {usernameOrEmail : usernameOrEmail, projectId : projectId})
        if(response.status == 201){
            return response.data
        }
        else{
            console.error("Error adding collaborator")
            throw new Error("No user found")
        }
    } catch (error) {
        console.error("Error adding collaborator")
        throw new Error(error.response.data)
    }
} 

export const removeCollaboratorApi = async (username, projectId) => {
    try{
        const response = await api.delete(`/collaborators?${username}&${projectId}`)
        if(response.status === 200){
            console.log("response : " + response.data)
            return response.data
        }
        else{
            console.error("Error removing collaborator")
            throw new Error("No user found")
        }
    } catch (error) {
        console.error("Error removing collaborator")
        throw new Error(error.response.data)
    }
}

export const getCollaboratorsByProjectIdApi = async (id) => {
    try {
        const response = await api.get(`/collaborators?${id}`)
        return response.data;
    } catch (error) {
        throw new Error(error.response.data)
    }
}

export const getCollaborationsProjectsApi = async () => {
    try {
        const response = await api.get("/projects/collaborators")
        return response.data
    } catch (error) {
        throw new Error(error.response.data)
    }
}