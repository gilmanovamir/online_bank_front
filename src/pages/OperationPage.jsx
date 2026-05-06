import {useCallback, useEffect, useState} from "react";
import {
    VStack,
    HStack,
    Heading,
    Button,
    Input,
    Alert,
    Field,
    NativeSelect,
    Box,
    Separator,
    Text,
} from "@chakra-ui/react";
import {AccountApi, OperationApi} from "../api";
import {useForm} from "../hooks/useForm";
import OperationTable from "../features/OperationTable";

const CURRENCIES = ["RUB", "USD", "CNY"];

const INITIAL_VALUES = {
    accountNumber: "",
    amount: "",
    description: "",
    selectedCurrencyCode: "RUB",
};

const BUY_INITIAL_VALUES = {
    baseAccountNumber: "",
    targetAccountNumber: "",
    amount: "",
};

const AccountSelect = ({name, value, onChange, accounts, placeholder = "Выберите счёт"}) => (
    <NativeSelect.Root>
        <NativeSelect.Field name={name} value={value} onChange={onChange}>
            <option value="">{placeholder}</option>
            {accounts.map((acc) => (
                <option key={acc.accountNumber} value={acc.accountNumber}>
                    {acc.accountNumber} — {acc.balance} {acc.currencyCode}
                </option>
            ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator/>
    </NativeSelect.Root>
);

const OperationPage = () => {
    const {values, handleChange} = useForm(INITIAL_VALUES);
    const {values: buyValues, handleChange: handleBuyChange} = useForm(BUY_INITIAL_VALUES);

    const [loading, setLoading] = useState(false);
    const [buyLoading, setBuyLoading] = useState(false);
    const [error, setError] = useState(null);
    const [buyError, setBuyError] = useState(null);
    const [operations, setOperations] = useState([]);
    const [accounts, setAccounts] = useState([]);

    const fetchAccounts = useCallback(async () => {
        try {
            const data = await AccountApi.findAllByHolder();
            setAccounts(data);
        } catch {
            setError("Не удалось загрузить счета");
        }
    }, []);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    const executeOperation = async (apiMethod) => {
        const amount = parseFloat(values.amount);
        if (isNaN(amount) || amount <= 0) {
            setError("Введите корректную сумму");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await apiMethod({...values, amount});
            setOperations((prev) => [result, ...prev]);
            await fetchAccounts()
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBuyCurrency = async () => {
        const amount = parseFloat(buyValues.amount);
        if (isNaN(amount) || amount <= 0) {
            setBuyError("Введите корректную сумму");
            return;
        }
        if (!buyValues.baseAccountNumber || !buyValues.targetAccountNumber) {
            setBuyError("Выберите оба счёта");
            return;
        }
        if (buyValues.baseAccountNumber === buyValues.targetAccountNumber) {
            setBuyError("Счёта списания и зачисления должны быть разными");
            return;
        }
        setBuyLoading(true);
        setBuyError(null);
        try {
            const results = await OperationApi.buyCurrency({...buyValues, amount});
            setOperations((prev) => [...results, ...prev]);
            await fetchAccounts();
        } catch (err) {
            setBuyError(err.message);
        } finally {
            setBuyLoading(false);
        }
    };

    return (
        <VStack gap={6} align="stretch">
            <Heading size="lg" textAlign="center">Операции со счётом</Heading>

            {/* ── Пополнение / Снятие ── */}
            <Box p={6} borderRadius="xl" border="1px solid" borderColor="gray.200" bg="white">
                <Heading size="sm" color="white.700">Зачислить валюту на счет</Heading>
                <VStack gap={4} align="stretch">
                    <Field.Root required>
                        <Field.Label fontSize="sm">Счёт</Field.Label>
                        <AccountSelect
                            name="accountNumber"
                            value={values.accountNumber}
                            onChange={handleChange}
                            accounts={accounts}
                        />
                    </Field.Root>

                    <Field.Root required>
                        <Field.Label fontSize="sm">Сумма</Field.Label>
                        <Input
                            type="number"
                            name="amount"
                            value={values.amount}
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
                                    <option key={code} value={code}>{code}</option>
                                ))}
                            </NativeSelect.Field>
                            <NativeSelect.Indicator/>
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
                        <Button variant="outline" alignSelf="flex-end"  colorPalette="blue" flex="1" loading={loading}
                                onClick={() => executeOperation(OperationApi.receive)}>
                            Пополнить
                        </Button>
                        <Button variant="outline" alignSelf="flex-end"  colorPalette="red" flex="1" loading={loading}
                                onClick={() => executeOperation(OperationApi.withdraw)}>
                            Снять
                        </Button>
                    </HStack>
                </VStack>
            </Box>

            {error && (
                <Alert.Root status="error" borderRadius="lg">
                    <Alert.Indicator/>
                    <Alert.Content><Alert.Title>{error}</Alert.Title></Alert.Content>
                </Alert.Root>
            )}

            <Separator/>

            {/* ── Покупка валюты ── */}
            <Box p={6} borderRadius="xl" border="1px solid" borderColor="gray.200" bg="white">
                <VStack gap={4} align="stretch">
                    <Heading size="sm" color="white.700">Купить валюту</Heading>
                    <Text fontSize="sm" color="gray.500">
                        Покупка валюты между счетами
                    </Text>

                    <Field.Root required>
                        <Field.Label fontSize="sm">Счёт списания</Field.Label>
                        <AccountSelect
                            name="baseAccountNumber"
                            value={buyValues.baseAccountNumber}
                            onChange={handleBuyChange}
                            accounts={accounts}
                            placeholder="Выберите счёт списания"
                        />
                    </Field.Root>

                    <Field.Root required>
                        <Field.Label fontSize="sm">Счёт зачисления</Field.Label>
                        <AccountSelect
                            name="targetAccountNumber"
                            value={buyValues.targetAccountNumber}
                            onChange={handleBuyChange}
                            accounts={accounts.filter(
                                (acc) => acc.accountNumber !== buyValues.baseAccountNumber
                            )}
                            placeholder="Выберите счёт зачисления"
                        />
                    </Field.Root>

                    <Field.Root required>
                        <Field.Label fontSize="sm">Сумма списания</Field.Label>
                        <Input
                            type="number"
                            name="amount"
                            value={buyValues.amount}
                            onChange={handleBuyChange}
                            placeholder="0.00"
                            bg="white"
                        />
                    </Field.Root>
                    <Button
                        variant="outline"
                        alignSelf="flex-end"
                        colorPalette="blue"
                        loading={buyLoading}
                        onClick={handleBuyCurrency}
                        w="full"
                    >
                        Перевести
                    </Button>
                </VStack>
            </Box>

            {buyError && (
                <Alert.Root status="error" borderRadius="lg">
                    <Alert.Indicator/>
                    <Alert.Content><Alert.Title>{buyError}</Alert.Title></Alert.Content>
                </Alert.Root>
            )}

            <Box>
                <Heading size="md" mb={4}>История текущей сессии</Heading>
                <OperationTable operations={operations}/>
            </Box>
        </VStack>
    );
};

export default OperationPage;