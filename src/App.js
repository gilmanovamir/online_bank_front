import React, {useState} from 'react';
import {
    Box,
    Flex,
    VStack,
    Text,
    Button,
    Heading,
    Separator
} from '@chakra-ui/react';

// Импортируем хук из сгенерированных компонентов Chakra v3
import {useColorMode} from "./components/ui/color-mode";
// Исправили импорт: обе иконки теперь из Lucide (react-icons/lu)
import {LuSun, LuMoon} from "react-icons/lu";

import AccountPage from "./pages/AccountPage";
import OperationPage from "./pages/OperationPage";
import AuthenticationPage from "./pages/AuthenticationPage";
import BonusPage from "./pages/BonusPage";
import CurrencyPage from "./pages/CurrencyPage";
import PartnerPage from "./pages/PartnerPage";
import PayPage from "./pages/PayPage";
import QuestPage from "./pages/QuestPage";
import TestPage from "./pages/TestPage";
import CodePage from "./pages/CodePage";
import {AuthApi} from "./api";
import {getDeviceId} from "./utils/authUtils";
import {TokenService} from "./utils/tokenService";
import {getUserRole} from "./utils/authUtils";

function App() {
    // 1. Инициализируем хук переключения темы
    const {colorMode, toggleColorMode} = useColorMode();

    const userRole = getUserRole();
    const [auth, setAuth] = useState(() => !!TokenService.getRefresh());
    const isAuthenticated = auth;
    const savedPage = localStorage.getItem("lastPage");

    const [currentComponent, setCurrentComponent] = useState(
        isAuthenticated ? (savedPage || 'account') : 'authentication'
    );

    const handleNavigate = (page) => {
        setCurrentComponent(page);
        localStorage.setItem("lastPage", page);
    };

    const handleLogout = async () => {
        const refresh = TokenService.getRefresh();
        if (refresh) {
            await AuthApi.logout(refresh, getDeviceId());
        }
        TokenService.clear();
        setAuth(false);
        setCurrentComponent("authentication");
        localStorage.removeItem("lastPage");
    };

    const menuGroups = [
        {
            title: "Пользователь",
            items: [
                ...(!isAuthenticated ? [{id: 'authentication', label: 'Вход'}] : []),
                {id: 'account', label: 'Мои счета'},
            ]
        },
        {
            title: "Финансы",
            items: [
                {id: 'operation', label: 'Операции'},
                {id: 'pay', label: 'Платежи'},
                {id: 'bonusAccount', label: 'Бонусы'},
                {id: 'currency', label: 'Валюты'},
            ]
        },
        {
            title: "Сервисы",
            items: [
                {id: 'partner', label: 'Партнеры'},
                {id: 'quest', label: 'Квесты'},
            ]
        },
        {
            title: "Админ",
            items: [
                {id: 'code', label: 'Коды'},
                {id: 'test', label: 'Тесты'},
            ]
        }
    ];

    const filteredMenuGroups = menuGroups.filter(group => {
        if (group.title === "Админ") return userRole === "ROLE_ADMIN";
        return true;
    });

    const renderComponent = () => {
        const isAdmin = userRole === "ROLE_ADMIN";
        if (isAuthenticated && (currentComponent === 'authentication' || currentComponent === 'registration')) {
            return <AccountPage/>;
        }

        switch (currentComponent) {
            case 'account':
                return <AccountPage/>;
            case 'authentication':
            case 'registration':
                return <AuthenticationPage
                    initialMode={currentComponent}
                    onSuccess={() => {
                        setAuth(true);
                        setCurrentComponent('account');
                    }}
                    userRole={userRole}
                />;
            case 'bonusAccount':
                return <BonusPage/>;
            case 'currency':
                return <CurrencyPage/>;
            case 'operation':
                return <OperationPage/>;
            case 'partner':
                return <PartnerPage/>;
            case 'pay':
                return <PayPage/>;
            case 'quest':
                return <QuestPage/>;
            case 'test':
                return isAdmin ? <TestPage/> : null;
            case 'code':
                return isAdmin ? <CodePage/> : null;
            default:
                return isAuthenticated ? <AccountPage/> : <AuthenticationPage/>;
        }
    };

    return (
        <Flex minH="100vh" bg="bg.canvas">
            {/* SIDEBAR */}
            <Box
                as="aside"
                w="280px"
                bg="bg.panel"
                borderRight="1px solid"
                borderColor="border.muted"
                pos="fixed"
                h="full"
                p={5}
                zIndex="sticky"
            >
                <Flex direction="column" h="full">
                    <Heading size="md" textAlign="center" color="blue.600" mb={8}>
                        Online Bank
                    </Heading>

                    <VStack align="stretch" gap={6} flex="1" overflowY="auto">
                        {filteredMenuGroups.map(group => (
                            <Box key={group.title}>
                                <Text
                                    fontSize="2xs"
                                    fontWeight="bold"
                                    color="fg.muted"
                                    textTransform="uppercase"
                                    letterSpacing="widest"
                                    mb={2}
                                    ml={2}
                                >
                                    {group.title}
                                </Text>
                                <VStack align="stretch" gap={1}>
                                    {group.items.map(item => (
                                        <Button
                                            key={item.id}
                                            variant={currentComponent === item.id ? "solid" : "ghost"}
                                            bg={currentComponent === item.id ? "blue.600" : "transparent"}
                                            color={currentComponent === item.id ? "white" : "fg.muted"}
                                            _hover={{bg: currentComponent === item.id ? "blue.700" : "bg.muted"}}
                                            justifyContent="flex-start"
                                            onClick={() => handleNavigate(item.id)}
                                            size="sm"
                                        >
                                            {item.label}
                                        </Button>
                                    ))}
                                </VStack>
                            </Box>
                        ))}
                    </VStack>

                    {/* СЕКЦИЯ НАСТРОЕК И ВЫХОДА */}
                    <Box pt={4}>
                        <Separator mb={4} borderColor="border.muted"/>

                        <Button
                            onClick={toggleColorMode}
                            variant="ghost"
                            size="sm"
                            width="full"
                            justifyContent="flex-start"
                            mb={2}
                        >
                            {colorMode === "dark" ? <LuSun/> : <LuMoon/>}
                            {colorMode === "dark" ? "Светлая тема" : "Тёмная тема"}
                        </Button>

                        {/* КНОПКА ВЫХОДА */}
                        {isAuthenticated && (
                            <Button
                                onClick={handleLogout}
                                variant="ghost"
                                size="sm"
                                width="full"
                                justifyContent="flex-start"
                                color="red.500"
                            >
                                Выйти
                            </Button>
                        )}
                    </Box>
                </Flex>
            </Box>

            <Box ml="280px" p={8} flex="1">
                {renderComponent()}
            </Box>
        </Flex>
    );
}

export default App;