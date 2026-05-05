import {jwtDecode} from "jwt-decode";

var roles = [];
export const getUserRole = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        return decoded.roles
    } catch (e) {
        console.error("Can not parse jwt token")
        return null;
    }
};

export const getDeviceId = () => {
    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId || deviceId === "undefined") {
        deviceId = crypto.randomUUID()
        localStorage.setItem("deviceId", deviceId)
    }
    return deviceId;
};