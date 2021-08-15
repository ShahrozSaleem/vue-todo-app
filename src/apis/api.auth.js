import Axios from "axios";

function login(email, pass) {
    return Axios.request({
        method: "POST",
        url: "/api/login",
        data: {
            "email": email,
            "password": pass
        }
    });
}

function logout(token) {
    let formData = new FormData();
    formData.set("token", token);

    return Axios.request({
        method: "POST",
        url: "/api/logout",
        data: formData
    });
}

function register(email, pass, confirm) {
    let formData = new FormData();
    formData.set("email", email);
    formData.set("password", pass);
    formData.set("password_confirmation", confirm);

    return Axios.request({
        method: "POST",
        url: "/api/register",
        data: formData
    });
}

function refreshToken(token) {
    return Axios.request({
        method: "POST",
        url: "/refresh-token/" + token
    });
}


const authApi = {
    login,
    logout,
    register,
    refreshToken
}

export default authApi;