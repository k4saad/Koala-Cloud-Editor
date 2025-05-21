export const setToken = (token, username) => {
    localStorage.setItem("username", username)
    localStorage.setItem("jwtToken", token)
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const removeToken = () => {
    localStorage.removeItem("username")
    localStorage.removeItem("jwtToken")
};