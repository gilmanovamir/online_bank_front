import React, { useEffect, useState } from "react";
import {
    VStack,
    Box,
    Heading,
    Text,
    Separator,
    Spinner,
    HStack
} from "@chakra-ui/react";
import { AccountApi, OperationApi } from "../api";
import { useAccountForm } from "../hooks/useAccountForm";
import AccountCreateForm from "../features/AccountCreateForm";
import AccountTable from "../features/AccountTable";
import OperationTable from "../features/OperationTable";
import { getUserRole } from "../utils/authUtils";

const AccountPage = () => {
    const { currencyCode, setCurrencyCode } = useAccountForm();

    const [accounts, setAccounts] = useState([]);
    const [operations, setOperations] = useState([]);
    const [selectedAcc, setSelectedAcc] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = async (apiFunc, successCallback) => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiFunc();
            if (successCallback) successCallback(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Загрузка счетов при входе на страницу
    useEffect(() => {
        request(AccountApi.findAllByHolder, setAccounts);
    }, []);

    const handleShowHistory = (accNum) => {
        setSelectedAcc(accNum);
        request(
            () => OperationApi.findAllByAccountNumber(accNum, 0, 10),
            (data) => setOperations(data)
        );
    };

    const handleCreateAccount = () => {
        request(
            () => AccountApi.createAccount(currencyCode),
            (data) => {
                alert(`Счет ${data.accountNumber} успешно открыт!`);
                // Обновляем список, чтобы новый счет появился в таблице с балансом
                request(AccountApi.findAllByHolder, setAccounts);
            }
        );
    };

    return (
        <VStack gap={6} align="stretch" maxW="1000px" mx="auto">
            <Heading size="lg" textAlign="center">Управление счетами</Heading>

            {/* Секция создания счета */}
            <Box
                p={5}
                bg="bg.panel"
                border="1px solid"
                borderColor="border.muted"
                borderRadius="xl"
            >
                <AccountCreateForm
                    currencyCode={currencyCode}
                    setCurrencyCode={setCurrencyCode}
                    onCreate={handleCreateAccount}
                    loading={loading}
                />
            </Box>

            {/* Основная таблица счетов */}
            <Box as="section">
                <Heading size="md" mb={4}>Список активных счетов</Heading>

                {accounts.length > 0 ? (
                    <AccountTable accounts={accounts} onShowHistory={handleShowHistory}/>
                ) : (
                    /* ИСПРАВЛЕНО: Адаптивный цвет текста заглушки */
                    <Text color="fg.muted">У вас пока нет открытых счетов.</Text>
                )}
            </Box>

            {/* ИСПРАВЛЕНО: Вывод ошибок через адаптивный красный текст */}
            {error && <Text color="red.fg" fontWeight="medium">Ошибка: {error}</Text>}

            {/* ИСПРАВЛЕНО: Спиннер загрузки заменен на стандартный Chakra Loader */}
            {loading && (
                <HStack gap={2} justify="center" py={2}>
                    <Spinner size="sm" color="blue.500" />
                    <Text fontSize="sm" color="fg.muted">Обработка запроса...</Text>
                </HStack>
            )}

            {/* История операций */}
            {selectedAcc && (
                /* ИСПРАВЛЕНО: section заменен на Box с адаптивным верхним отступом */
                <Box as="section" pt={4}>
                    {/* ИСПРАВЛЕНО: Заменили захардкоженную серую линию на системный сепаратор */}
                    <Separator mb={6} borderColor="border.muted" />

                    <Heading size="md" mb={4}>
                        {/* ИСПРАВЛЕНО: Синий цвет выделения заменен на адаптивный blue.fg */}
                        История по счету: <Box as="span" color="blue.fg">{selectedAcc}</Box>
                    </Heading>

                    {operations.length > 0 ? (
                        <OperationTable operations={operations}/>
                    ) : (
                        /* ИСПРАВЛЕНО: Адаптивный цвет для текста пустой истории */
                        <Text color="fg.muted">Операций по этому счету не найдено.</Text>
                    )}
                </Box>
            )}
        </VStack>
    );
};

export default AccountPage;
