import api from "../apis";

const TOKEN_KEY = "authToken";

function getAuthToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function setAuthToken(token) {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
        api.setToken(token);
    }
}

function removeAuthToken() {
    localStorage.removeItem(TOKEN_KEY);
    api.removeToken();
}

export {
    getAuthToken,
    setAuthToken,
    removeAuthToken
}