import React, {useEffect, useState, useCallback} from "react";
import {VStack, Heading, Alert, Box} from "@chakra-ui/react";
import {AccountApi, PayApi} from "../api";
import {usePayForm} from "../hooks/usePayForm";
import PayForm from "../features/PayForm";
import OperationTable from "../features/OperationTable";

const PayPage = () => {
    const {values, handleChange, reset} = usePayForm();
    const [status, setStatus] = useState({loading: false, error: null});
    const [response, setResponse] = useState(null);
    const [accounts, setAccounts] = useState([]);

    // Вынес загрузку счетов в отдельную функцию
    const fetchAccounts = useCallback(async () => {
        try {
            const data = await AccountApi.findAllByHolder();
            setAccounts(data);
        } catch (err) {
            console.error("Account loading failed:", err);
            setStatus(s => ({...s, error: "Не удалось загрузить список счетов"}));
        }
    }, []);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({loading: true, error: null});
        setResponse(null);

        try {
            const payload = {
                ...values,
                serviceRequestAmount: parseFloat(values.serviceRequestAmount),
            };

            const result = await PayApi.pay(payload);
            setResponse(result);
            reset();
        } catch (err) {
            setStatus(s => ({...s, error: err.message || "Ошибка при совершении платежа"}));
        } finally {
            setStatus(s => ({...s, loading: false}));
        }
    };

    return (
        <VStack gap={6} align="stretch" maxW="600px" mx="auto" py={8}>
            <Heading size="lg" textAlign="center">Выполнение платежа</Heading>
            <Box
                p={6}
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.200"
                bg="white"
            >
                <PayForm
                    values={values}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    loading={status.loading}
                    accounts={accounts}
                />
            </Box>

            {status.error && (
                <Alert.Root status="error" variant="subtle" borderRadius="lg">
                    <Alert.Indicator/>
                    <Alert.Content>
                        <Alert.Title>{status.error}</Alert.Title>
                    </Alert.Content>
                </Alert.Root>
            )}

            {response && (
                <Box mt={4} p={4} border="1px solid" borderColor="green.200" borderRadius="xl">
                    <Heading size="md" mb={4} color="green.600">Операция успешна</Heading>
                    <OperationTable operations={[response]}/>
                </Box>
            )}
        </VStack>
    );
};

export default PayPage;