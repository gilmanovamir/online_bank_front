import React, { useCallback, useEffect, useState } from "react";
import {
    Box,
    VStack,
    HStack,
    Heading,
    Button,
    Input,
    Alert,
    Field,
    NativeSelect,
} from "@chakra-ui/react";
import { AccountApi, OperationApi } from "../api";
import { useForm } from "../hooks/useForm";
import OperationTable from "../features/OperationTable";

const CURRENCIES = ["RUB", "USD", "CNY"];

const INITIAL_VALUES = {
    accountNumber: "",
    providedAmountInBaseCurrency: "",
    description: "",
    selectedCurrencyCode: "RUB",
};

const OperationPage = () => {
    const { values, handleChange, reset } = useForm(INITIAL_VALUES);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [operations, setOperations] = useState([]);
    const [accounts, setAccounts] = useState([]);

    // загрузка счетов
    const fetchAccounts = useCallback(async () => {
        try {
            const data = await AccountApi.findAllByHolder();
            setAccounts(data);
        } catch (err) {
            setError("Не удалось загрузить счета");
        }
    }, []);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    const executeOperation = async (apiMethod) => {
        setLoading(true);
        setError(null);

        try {
            const payload = {
                ...values,
                providedAmountInBaseCurrency: parseFloat(values.providedAmountInBaseCurrency),
            };

            const result = await apiMethod(payload);

            setOperations((prev) => [result, ...prev]);
            reset();
        } catch (err) {
            setError(err.message || "Ошибка операции");
        } finally {
            setLoading(false);
        }
    };

    return (
        <VStack gap={6} align="stretch" maxW="600px" mx="auto" py={8}>
            <Heading size="lg" textAlign="center">
                Операции со счётом
            </Heading>

            <Box p={6} borderRadius="xl" border="1px solid" borderColor="gray.200" bg="white">
                <VStack gap={4} align="stretch">

                    <Field.Root required>
                        <Field.Label fontSize="sm">Счёт</Field.Label>
                        <NativeSelect.Root>
                            <NativeSelect.Field
                                name="accountNumber"
                                value={values.accountNumber}
                                onChange={handleChange}
                            >
                                <option value="">Выберите счёт</option>
                                {accounts.map((acc) => (
                                    <option key={acc.accountNumber} value={acc.accountNumber}>
                                        {acc.accountNumber} — {acc.balance} {acc.currencyCode}
                                    </option>
                                ))}
                            </NativeSelect.Field>
                        </NativeSelect.Root>
                    </Field.Root>

                    <Field.Root required>
                        <Field.Label fontSize="sm">Сумма</Field.Label>
                        <Input
                            type="number"
                            name="amount"
                            value={values.providedAmountInBaseCurrency}
                            onChange={handleChange}
                            placeholder="0.00"
                        />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label fontSize="sm">Валюта операции</Field.Label>
                        <NativeSelect.Root>
                            <NativeSelect.Field
                                name="selectedCurrencyCode"
                                value={values.selectedCurrencyCode}
                                onChange={handleChange}
                            >
                                {CURRENCIES.map((code) => (
                                    <option key={code} value={code}>
                                        {code}
                                    </option>
                                ))}
                            </NativeSelect.Field>
                        </NativeSelect.Root>
                    </Field.Root>

                    <Field.Root>
                        <Field.Label fontSize="sm">Описание</Field.Label>
                        <Input
                            name="description"
                            value={values.description}
                            onChange={handleChange}
                            placeholder="Назначение платежа"
                        />
                    </Field.Root>

                    <HStack gap={3} pt={2}>
                        <Button
                            colorPalette="blue"
                            flex="1"
                            loading={loading}
                            onClick={() => executeOperation(OperationApi.receive)}
                        >
                            Пополнить
                        </Button>

                        <Button
                            colorPalette="red"
                            flex="1"
                            loading={loading}
                            onClick={() => executeOperation(OperationApi.withdraw)}
                        >
                            Снять
                        </Button>
                    </HStack>
                </VStack>
            </Box>

            {error && (
                <Alert.Root status="error" borderRadius="lg">
                    <Alert.Indicator />
                    <Alert.Content>
                        <Alert.Title>{error}</Alert.Title>
                    </Alert.Content>
                </Alert.Root>
            )}

            <Box>
                <Heading size="md" mb={4}>
                    История текущей сессии
                </Heading>
                <OperationTable operations={operations} />
            </Box>
        </VStack>
    );
};

export default OperationPage;