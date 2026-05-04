import React, {useState, useEffect} from "react";
import {
    Box,
    Button,
    Container,
    Heading,
    Text,
    VStack,
    Alert,
    Center,
    Tabs,
    Flex,
} from "@chakra-ui/react";
import {AuthApi, RegistrationApi, CodeApi} from "../api";
import {useAuthForms} from "../hooks/useAuthForms";
import {TokenService} from "../utils/tokenService";
import {LoginSection, VerifySection} from "../features/AuthForm";
import RegistrationForm from "../features/RegistrationForm";
import {getDeviceId} from "../utils/authUtils";
import {getDeviceName} from "../utils/deviceService";

// ─── Вспомогательные функции ──────────────────────────────────────────────────

const getDeviceInfo = () => ({
    deviceId: getDeviceId(),
    deviceName: getDeviceName(),
    userAgent: navigator.userAgent,
});

const redirectAfter = (delay, callback) =>
    setTimeout(() => (callback ? callback() : window.location.reload()), delay);

// ─── Подкомпоненты ────────────────────────────────────────────────────────────

const StatusAlert = ({status, message, fontSize}) => (
    <Alert.Root status={status} mb={4} borderRadius="lg" variant={status === "info" ? "subtle" : undefined}>
        <Alert.Indicator/>
        <Alert.Content>
            {status === "error"
                ? <Alert.Title>{message}</Alert.Title>
                : <Text fontSize={fontSize ?? "sm"}>{message}</Text>
            }
        </Alert.Content>
    </Alert.Root>
);

const AlreadyAuthenticatedView = ({userRole, resendStatus, loading, onSuccess, onLogout}) => (
    <Center py={10}>
        <Box
            bg="white" p={8} borderRadius="2xl" boxShadow="xl"
            textAlign="center" maxW="400px" border="1px solid" borderColor="gray.100"
        >
            <VStack gap={4}>
                <Heading size="md">Вы уже в системе</Heading>
                <Text>Вы вошли как <b>{userRole || "Пользователь"}</b></Text>
                {resendStatus && <Text color="blue.500" fontSize="sm">{resendStatus}</Text>}
                <Flex gap={3} w="full">
                    <Button colorPalette="blue" flex="1" onClick={onSuccess}>Кабинет</Button>
                    <Button variant="outline" colorPalette="red" flex="1" onClick={onLogout} loading={loading}>
                        Выход
                    </Button>
                </Flex>
            </VStack>
        </Box>
    </Center>
);

const CompletedView = () => (
    <VStack py={10} gap={4}>
        <Box fontSize="5xl">Подтверждено!</Box>
        <Heading size="md" color="green.500">Добро пожаловать!</Heading>
        <Text>Вы успешно авторизованы.</Text>
    </VStack>
);

const VerifyView = ({form, onChange, onVerify, onResend, loading, onBack}) => (
    <VStack gap={6}>
        <Heading size="lg">Подтверждение</Heading>
        <VerifySection
            form={form}
            onChange={onChange}
            onVerify={onVerify}
            onResend={onResend}
            loading={loading}
        />
        <Button variant="ghost" size="sm" onClick={onBack}>← Вернуться к входу</Button>
    </VStack>
);

const AuthTabsView = ({
                          mode,
                          onModeChange,
                          loginForm,
                          handleLoginChange,
                          handleLogin,
                          regForm,
                          handleRegChange,
                          handleRegister,
                          loading,
                          userRole
                      }) => (
    <VStack gap={6} align="stretch">
        <Heading size="xl" textAlign="center" color="blue.600" mb={2}>Online Bank</Heading>

        <Tabs.Root variant="enclosed" value={mode} onValueChange={(d) => onModeChange(d.value)}>
            <Tabs.List mb="1em" display="flex">
                <Tabs.Trigger value="login" flex="1" fontWeight="bold">Вход</Tabs.Trigger>
                <Tabs.Trigger value="register" flex="1" fontWeight="bold">Регистрация</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="login" p={0} mt={4}>
                <LoginSection
                    form={loginForm}
                    onChange={handleLoginChange}
                    onLogin={handleLogin}
                    loading={loading}
                />
            </Tabs.Content>

            <Tabs.Content value="register" p={0} mt={4}>
                <RegistrationForm
                    values={regForm}
                    onChange={handleRegChange}
                    onSubmit={(e) => handleRegister(e, false)}
                    onAdminSubmit={() => handleRegister(null, true)}
                    loading={loading}
                    showAdminButton={userRole === "ROLE_ADMIN"}
                />
            </Tabs.Content>
        </Tabs.Root>
    </VStack>
);

// ─── Основной компонент ───────────────────────────────────────────────────────

const AuthenticationPage = ({initialMode = "login", onSuccess, userRole}) => {
    const [isNewUser, setIsNewUser] = useState(false);
    const [mode, setMode] = useState(initialMode === "registration" ? "register" : "login");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [resendStatus, setResendStatus] = useState("");

    const {
        loginForm, handleLoginChange,
        regForm, handleRegChange,
        verifyForm, handleVerifyChange, setVerifyForm,
    } = useAuthForms();

    useEffect(() => {
        if (mode !== "verify" && mode !== "completed") {
            setMode(initialMode === "registration" ? "register" : "login");
        }
    }, [initialMode]);

    const execute = async (task) => {
        setLoading(true);
        setError(null);
        setResendStatus("");
        try {
            await task();
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Произошла ошибка");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => execute(async () => {
        const refresh = TokenService.getRefresh();
        if (refresh) {
            try {
                await AuthApi.logout(refresh, getDeviceId());
            } catch (e) {
                console.error("Logout API failed", e);
            }
        }
        TokenService.clear();
        setResendStatus("Вы вышли из системы");
        redirectAfter(1000);
    });

    const handleLogin = () => execute(async () => {
        const payload = {email: loginForm.email, password: loginForm.password, ...getDeviceInfo()};

        try {
            const res = await AuthApi.login(payload);
            TokenService.save(res.data);
            setMode("completed");
            redirectAfter(1000, onSuccess);
        } catch (err) {
            if (err.response?.status !== 403) throw err;

            setVerifyForm(prev => ({
                ...prev,
                email: loginForm.email,
                deviceId: getDeviceId(),
            }));
            setMode("verify");
            setResendStatus("Новое устройство: подтвердите личность кодом из письма");
        }
    });

    const handleRegister = (e, isAdmin = false) => {
        e?.preventDefault();
        execute(async () => {
            const apiCall = isAdmin ? RegistrationApi.signUpAdmin : RegistrationApi.signUp;
            await apiCall(regForm);
            setIsNewUser(true);
            setVerifyForm(prev => ({...prev, email: regForm.email}));
            setMode("verify");
        });
    };

    const handleVerify = () => execute(async () => {
        const payload = {
            email: verifyForm.email,
            verificationCode: verifyForm.verificationCode,
            ...getDeviceInfo(),
        };
        const response = isNewUser
            ? await RegistrationApi.verifyFirst(payload)
            : await AuthApi.verifyDefault(payload);

        TokenService.save(response.data);
        setMode("completed");
        redirectAfter(1500, onSuccess);
    });

    const handleResend = () => execute(async () => {
        await CodeApi.regenerateOtp(verifyForm.email);
        setResendStatus("Код отправлен повторно");
    });

    const isAuthenticated = !!TokenService.getRefresh();
    const isTabMode = mode === "login" || mode === "register";

    if (isAuthenticated && isTabMode) {
        return (
            <AlreadyAuthenticatedView
                userRole={userRole}
                resendStatus={resendStatus}
                loading={loading}
                onSuccess={onSuccess}
                onLogout={handleLogout}
            />
        );
    }

    return (
        <Container maxW="lg" centerContent py={10}>
            <Box bg="white" w="full" p={8} borderRadius="2xl" boxShadow="2xl" border="1px solid" borderColor="gray.50">
                {error && <StatusAlert status="error" message={error}/>}
                {resendStatus && <StatusAlert status="info" message={resendStatus}/>}

                {isTabMode && (
                    <AuthTabsView
                        mode={mode}
                        onModeChange={setMode}
                        loginForm={loginForm}
                        handleLoginChange={handleLoginChange}
                        handleLogin={handleLogin}
                        regForm={regForm}
                        handleRegChange={handleRegChange}
                        handleRegister={handleRegister}
                        loading={loading}
                        userRole={userRole}
                    />
                )}

                {mode === "verify" && (
                    <VerifyView
                        form={verifyForm}
                        onChange={handleVerifyChange}
                        onVerify={handleVerify}
                        onResend={handleResend}
                        loading={loading}
                        onBack={() => setMode("login")}
                    />
                )}

                {mode === "completed" && <CompletedView/>}
            </Box>
        </Container>
    );
};

export default AuthenticationPage;