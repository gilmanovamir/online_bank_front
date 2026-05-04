import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// 1. Интерцептор запроса: динамически берем токен из хранилища
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// 2. Интерцептор ответа: обработка 401 (Refresh Token) и ошибок бэкенда
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // --- ЛОГИКА REFRESH TOKEN (401) ---
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject});
                })
                    .then(token => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        return api(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem("refreshToken");
            const deviceId = localStorage.getItem("deviceId");

            if (refreshToken) {
                try {
                    // ВАЖНО: твой silentLogin в AuthenticationService ожидает token и deviceId
                    const res = await axios.post(`${API_URL}/api/silent`, {
                        token: refreshToken,
                        deviceId: deviceId
                    });

                    // Твой AuthenticationResponseDto возвращает { tokens: { accessToken, refreshToken } }
                    const data = res.data.tokens || res.data;
                    const {accessToken, refreshToken: newRefresh} = data;

                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("refreshToken", newRefresh);

                    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                    processQueue(null, accessToken);
                    return api(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    localStorage.clear();
                    // Редирект на логин, если сессия полностью протухла
                    window.location.href = "/";
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }
        }

        // --- УЛУЧШЕННАЯ ОБРАБОТКА ОШИБОК (403, 400, 404 и т.д.) ---
        if (error.response && error.response.data) {
            const serverData = error.response.data;

            if (typeof serverData === 'object' && serverData !== null) {
                // Если прилетел DeviceIdIsBlankException, пробрасываем deviceId в объект ошибки
                if (serverData.deviceId) {
                    error.deviceId = serverData.deviceId;
                }

                // Если есть поле message, берем его, иначе склеиваем все значения полей (для валидации)
                error.message = serverData.message || Object.values(serverData).join(", ");
            } else if (typeof serverData === 'string') {
                error.message = serverData;
            }
        }

        return Promise.reject(error);
    }
);

// Вспомогательная функция (обертка)
const request = (method, url, data = null, params = null) =>
    api({method, url, data, params}).then(res => res.data);

// ============================
// API Объекты
// ============================

export const RegistrationApi = {
    // Метод для первичной регистрации (отправка данных пользователя)
    signUp: (data) => api.post("/api/sign-up", data),

    // Метод для регистрации админа
    signUpAdmin: (data) => api.post("/api/sign-up/admin", data),

    // Метод для подтверждения кода после регистрации (ТОТ САМЫЙ, КОТОРОГО НЕ ХВАТАЛО)
    verifyFirst: (verifyData) => api.post("/api/first-verify/email", verifyData)
};

export const AuthApi = {
    login: (loginData) => api.post("/api/login", loginData),

    // Верификация существующего пользователя (вход с нового устройства / UA mismatch)
    verifyDefault: (verifyData) => api.post("/api/default-verify/email", verifyData),

    logout: (token, deviceId) => api.post("/api/logout", {token, deviceId})
};

export const AccountApi = {
    createAccount: (currencyCode) => request("post", "/api/account", null, {currencyCode}),
    getBalance: (num) => request("get", `/api/account/${num}`),
    findAllByHolder: () => request("get", "/api/account/find-all-by-holder"),
};

export const OperationApi = {
    receive: (data) => request("post", "/api/operation/receive", data),
    withdraw: (data) => request("post", "/api/operation/withdraw", data),
    buyCurrency: (data) => request("post", "/api/operation/buy-currency", data),
    findAllByAccountNumber: (num, page, size) =>
        request("get", "/api/operation/find-all-by-account-number", null, {accountNumber: num, page, size}),
    findAllByUser: (page, size) =>
        request("get", "/api/operation/find-all-operation-by-user", null, {page, size}),
};

export const BonusApi = {
    convert: (data) => request("post", "/api/bonus/convert", data),
    all: () => request("get", "/api/bonus")
};

export const CurrencyApi = {
    createExchangeRate: (base, target, providedAmountInBaseCurrency) => request("post", "/api/currency/create", {
        baseCurrency: base,
        targetCurrency: target,
        providedAmountInBaseCurrency: providedAmountInBaseCurrency
    }),
    convertCurrency: (data) => request("post", "/api/currency/convert", data),
    findRate: (base, target) => request("post", "/api/currency/find-rate", {
        baseCurrency: base,
        targetCurrency: target
    }),
};

export const PartnerApi = {
    createPartner: (data) => request("post", "/api/bank-partner", data),
    getAllPartners: () => request("get", "/api/bank-partner")
};

export const PayApi = {
    pay: (data) => request("post", "/api/pay", data),
};

export const QuestApi = {
    createRandomQuest: () => request("post", "/api/quest"),
    getUserQuests: () => request("get", "/api/quest/load-user")
};

export const UserApi = {
    deleteByPhoneNumber: (phone) => request("delete", `/api/user/${encodeURIComponent(phone)}`),
};

export const CodeApi = {
    deleteOldCodes: () => request("delete", "/api/verification-code"),
    regenerateOtp: (email) => request("patch", "/api/verification-code/update", {email}),
};

export const TestApi = {
    test: () => request("get", "/test"),
    pureJava: () => request("get", "/test/pure"),
    sendEmail: (email) => request("post", `/test/send-email?email=${encodeURIComponent(email)}`),
};

export default api;