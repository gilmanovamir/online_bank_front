import React, { useState } from "react";
import {
    VStack,
    HStack,
    Box,
    Heading,
    Text,
    Input,
    Button,
    Alert,
    Spinner,
    Center,
    Field,
} from "@chakra-ui/react";
import { CurrencyApi } from "../api";
import { useForm } from "../hooks/useForm";
import CurrencySelect from "../features/CurrencySelect";
import { getUserRole } from "../utils/authUtils";

const isAdminRole = (role) =>
    Array.isArray(role) ? role.includes("ROLE_ADMIN") : role === "ROLE_ADMIN";

// ─── Подкомпоненты результата ─────────────────────────────────────────────────

const ConvertResult = ({ data }) => {
    const rate = data.providedAmountInBaseCurrency
        ? (data.targetConvertedAmount / data.providedAmountInBaseCurrency).toFixed(4)
        : "—";

    return (
        <VStack gap={1} textAlign="center">
            <Text fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wide">
                Результат операции
            </Text>
            {/* ИСПРАВЛЕНО: Заменили green.700 на адаптивный green.fg */}
            <Heading size="lg" color="green.fg">
                {data.providedAmountInBaseCurrency} {data.baseCurrency}
                {" = "}
                {data.targetConvertedAmount} {data.targetCurrency}
            </Heading>
            <Text fontSize="sm" color="fg.muted">
                Курс обмена: 1 {data.baseCurrency} ≈ {rate} {data.targetCurrency}
            </Text>
        </VStack>
    );
};

const RateResult = ({ data }) => (
    <VStack gap={1} textAlign="center">
        {/* ИСПРАВЛЕНО: Заменили green.700 на адаптивный green.fg */}
        <Heading size="sm" color="green.fg">Курс обновлён</Heading>
        <Text fontSize="lg">
            Новое значение: 1 <b>{data.baseCurrency}</b> = <b>{data.rate} {data.targetCurrency}</b>
        </Text>
    </VStack>
);

const FallbackResult = ({ data }) => (
    /* ИСПРАВЛЕНО: Заменили gray.700 на fg */
    <Box as="pre" fontSize="xs" overflowX="auto" color="fg">
        {JSON.stringify(data, null, 2)}
    </Box>
);

const ResultCard = ({ response, onClear }) => {
    const renderContent = () => {
        if (response.providedAmountInBaseCurrency !== undefined) return <ConvertResult data={response} />;
        if (response.rate) return <RateResult data={response} />;
        return <FallbackResult data={response} />;
    };

    return (
        /* ИСПРАВЛЕНО: Адаптивные цвета для карточки успеха (зелёная в обеих темах) */
        <Box
            p={5}
            bg="green.solid/10"
            border="1px solid"
            borderColor="green.muted"
            borderRadius="xl"
        >
            {renderContent()}
            <Center mt={4}>
                <Button size="xs" variant="outline" colorPalette="gray" onClick={onClear}>
                    Очистить
                </Button>
            </Center>
        </Box>
    );
};

// ─── Обёртка секции формы ─────────────────────────────────────────────────────

const FormSection = ({ title, onSubmit, children }) => (
    <Box
        as="form"
        onSubmit={onSubmit}
        p={5}
        border="1px solid"
        borderColor="border.muted"
        borderRadius="xl"
        bg="bg.panel"
    >
        {/* ИСПРАВЛЕНО: Убран gray.700, цвет заголовка теперь адаптивный по умолчанию */}
        <Heading size="sm" mb={4}>{title}</Heading>
        <HStack gap={3} flexWrap="wrap" align="flex-end">
            {children}
        </HStack>
    </Box>
);

// ─── Основной компонент ───────────────────────────────────────────────────────

const CurrencyPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    const isAdmin = isAdminRole(getUserRole());

    const createForm = useForm({ baseCurrency: "USD", targetCurrency: "RUB", rate: "" });
    const convertForm = useForm({ baseCurrency: "USD", targetCurrency: "RUB", providedAmountInBaseCurrency: "" });
    const findForm = useForm({ baseCurrency: "USD", targetCurrency: "RUB" });

    const execute = async (requestFn) => {
        setLoading(true);
        setError(null);
        setResponse(null);
        try {
            setResponse(await requestFn());
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <VStack gap={6} align="stretch" maxW="800px" mx="auto">
            <Heading size="lg" textAlign="center">Валютный сервис</Heading>

            {/* Форма 1: Создание/обновление курса (только ADMIN) */}
            {isAdmin && <FormSection
                title="Создать / Обновить курс (ADMIN)"
                onSubmit={(e) => {
                    e.preventDefault();
                    execute(() => CurrencyApi.createExchangeRate(createForm.values));
                }}
            >
                <CurrencySelect label="Базовая" name="baseCurrency" value={createForm.values.baseCurrency}
                                onChange={createForm.handleChange} />
                <CurrencySelect label="Котируемая" name="targetCurrency" value={createForm.values.targetCurrency}
                                onChange={createForm.handleChange} />
                <Field.Root required>
                    <Field.Label fontSize="sm">Курс</Field.Label>
                    <Input
                        type="number"
                        name="rate"
                        step="0.0001"
                        placeholder="90.5000"
                        value={createForm.values.rate}
                        onChange={createForm.handleChange}
                        w="32"
                    />
                </Field.Root>
                <Button type="submit" colorPalette="blue" loading={loading}>Установить</Button>
            </FormSection>}

            {/* Форма 2: Конвертация */}
            <FormSection
                title="Конвертация суммы"
                onSubmit={(e) => {
                    e.preventDefault();
                    execute(() => CurrencyApi.convertCurrency({
                        ...convertForm.values,
                        providedAmountInBaseCurrency: Number(convertForm.values.providedAmountInBaseCurrency),
                    }));
                }}
            >
                <CurrencySelect label="Из" name="baseCurrency" value={convertForm.values.baseCurrency}
                                onChange={convertForm.handleChange} />
                <CurrencySelect label="В" name="targetCurrency" value={convertForm.values.targetCurrency}
                                onChange={convertForm.handleChange} />
                <Field.Root required>
                    <Field.Label fontSize="sm">Сумма</Field.Label>
                    <Input
                        type="number"
                        name="providedAmountInBaseCurrency"
                        placeholder="100"
                        value={convertForm.values.providedAmountInBaseCurrency}
                        onChange={convertForm.handleChange}
                        w="32"
                    />
                </Field.Root>
                <Button type="submit" variant="outline" colorPalette="blue" loading={loading}
                        alignSelf="flex-end">Рассчитать</Button>
            </FormSection>

            {/* Форма 3: Поиск курса */}
            <FormSection
                title="Узнать текущий курс"
                onSubmit={(e) => {
                    e.preventDefault();
                    execute(() => CurrencyApi.findRate(findForm.values.baseCurrency, findForm.values.targetCurrency));
                }}
            >
                <CurrencySelect label="Базовая" name="baseCurrency" value={findForm.values.baseCurrency}
                                onChange={findForm.handleChange} />
                <CurrencySelect label="Котируемая" name="targetCurrency" value={findForm.values.targetCurrency}
                                onChange={findForm.handleChange} />
                <Button type="submit" variant="outline" colorPalette="blue" loading={loading} alignSelf="flex-end">
                    Найти
                </Button>
            </FormSection>

            {/* Результаты загрузки */}
            {loading && (
                <Center py={4}>
                    <Spinner size="sm" color="blue.500" />
                    <Text ml={3} fontSize="sm" color="fg.muted">Обработка запроса...</Text>
                </Center>
            )}

            {/* ИСПРАВЛЕНО: Алерт ошибки теперь тоже адаптивный через статус */}
            {error && (
                <Alert.Root status="error" borderRadius="lg">
                    <Alert.Indicator />
                    <Alert.Content>
                        <Alert.Title>{error}</Alert.Title>
                    </Alert.Content>
                </Alert.Root>
            )}

            {/* Вывод результата операции */}
            {response && (
                <ResultCard response={response} onClear={() => setResponse(null)} />
            )}
        </VStack>
    );
};

export default CurrencyPage;
