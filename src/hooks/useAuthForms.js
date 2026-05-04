import {useState} from "react";

export const useAuthForms = () => {
    // Состояние для логина
    const [loginForm, setLoginForm] = useState({
        email: "", password: "", deviceId: "", deviceName: "", userAgent: navigator.userAgent,
    });

    // Состояние для регистрации
    const [regForm, setRegForm] = useState({
        name: "", surname: "", patronymic: "", phone: "", email: "", password: ""
    });

    // Состояние для верификации (OTP)
    const [verifyForm, setVerifyForm] = useState({
        email: "", verificationCode: "", deviceName: "", userAgent: navigator.userAgent
    });

    const handleLoginChange = (e) => setLoginForm(prev => ({...prev, [e.target.name]: e.target.value}));
    const handleRegChange = (e) => setRegForm(prev => ({...prev, [e.target.name]: e.target.value}));
    const handleVerifyChange = (e) =>
        setVerifyForm(prev => ({

            ...prev,
            [e.target.name]: e.target.value
        }));

    return {
        loginForm, handleLoginChange,
        regForm, handleRegChange,
        verifyForm, handleVerifyChange,
        setVerifyForm // Понадобится, чтобы подставить email после регистрации
    };
};