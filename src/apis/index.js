import axios from "axios";
import authApi from "./api.auth";
import todoApi from "./api.todo";

axios.defaults.baseURL = '';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

function setToken(AUTH_TOKEN) {
    axios.defaults.headers.common['Authorization'] = "Bearer " + AUTH_TOKEN;
}

function removeToken() {
    axios.defaults.headers.common['Authorization'] = "";
}

export default {
    login: authApi.login,
    logout: authApi.logout,
    register: authApi.register,
    refreshToken: authApi.refreshToken,

    getItems: todoApi.getItems,
    searchItems: todoApi.searchItems,
    getItem: todoApi.getItem,
    createItem: todoApi.createItem,
    updateItem: todoApi.updateItem,
    deleteItem: todoApi.deleteItem,

    setToken,
    removeToken
}