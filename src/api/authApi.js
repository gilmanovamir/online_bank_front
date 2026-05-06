import api from "./axiosConfig";

export const AuthApi = {
    login: (loginData) => api.post("/api/login", loginData),
    verifyDefault: (verifyData) => api.post("/api/default-verify/email", verifyData),
    logout: (refreshToken, deviceId) => api.post("/api/logout", {refreshToken, deviceId})
};