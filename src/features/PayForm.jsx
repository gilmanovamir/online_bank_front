import React, {useEffect, useState} from "react";
import {
    VStack,
    Input,
    Button,
    Box,
    Field,
    NativeSelect,
    Heading,
    Text,
} from "@chakra-ui/react";
import {PartnerApi} from "../api";

// ─── Секция формы ─────────────────────────────────────────────────────────────

const FormSection = ({title, children}) => (
    <Box>
        <Heading size="sm" mb={3} color="fg.muted">
            {title}
        </Heading>

        <VStack gap={4} align="stretch">
            {children}
        </VStack>
    </Box>
);

// ─── Основной компонент ───────────────────────────────────────────────────────

const PayForm = ({values, onChange, onSubmit, loading, accounts = []}) => {
    const senderAccount = values?.senderInfo?.accountNumberFrom || "";

    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);

    // debounce
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);

        return () => clearTimeout(timeout);
    }, [query]);

    // fetch suggestions
    useEffect(() => {
        if (!debouncedQuery) {
            setSuggestions([]);
            return;
        }

        setLoadingSuggestions(true);

        PartnerApi.findByContainingName(debouncedQuery)
            .then(setSuggestions)
            .catch(() => setSuggestions([]))
            .finally(() => setLoadingSuggestions(false));
    }, [debouncedQuery]);

    return (
        <Box as="form" onSubmit={onSubmit}>
            <VStack gap={8} align="stretch">

                {/* Счёт отправителя */}
                <FormSection title="Данные отправителя">
                    <Field.Root required>
                        <Field.Label fontSize="sm">
                            Счёт списания
                        </Field.Label>

                        <NativeSelect.Root>
                            <NativeSelect.Field
                                name="senderInfo.accountNumberFrom"
                                value={senderAccount}
                                onChange={onChange}
                            >
                                <option value="">
                                    Выберите счёт списания
                                </option>

                                {accounts.map((acc) => (
                                    <option
                                        key={acc.accountNumber}
                                        value={acc.accountNumber}
                                    >
                                        {acc.accountNumber} —{" "}
                                        {acc.balance} {acc.currencyCode}
                                    </option>
                                ))}
                            </NativeSelect.Field>

                            <NativeSelect.Indicator/>
                        </NativeSelect.Root>
                    </Field.Root>
                </FormSection>

                {/* Партнёр */}
                <FormSection title="Данные получателя">
                    <Field.Root required w="full">
                        <Field.Label fontSize="sm">
                            Партнёр
                        </Field.Label>

                        <Box position="relative" w="full">
                            <Input
                                w="full"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                }}
                                placeholder="Введите наименование сервиса"
                                autoComplete="off"
                            />

                            {/* dropdown */}
                            {suggestions.length > 0 && (
                                <Box
                                    position="absolute"
                                    top="100%"
                                    left="0"
                                    right="0"
                                    mt={2}
                                    bg="bg.panel"
                                    border="1px solid"
                                    borderColor="border.muted"
                                    borderRadius="lg"
                                    zIndex={20}
                                    boxShadow="lg"
                                    maxH="220px"
                                    overflowY="auto"
                                >
                                    {suggestions.map((p, index) => (
                                        <Box
                                            key={p.id}
                                            px={3}
                                            py={2}
                                            fontSize="sm"
                                            cursor="pointer"
                                            _hover={{bg: "bg.muted"}}
                                            borderBottom={
                                                index !==
                                                suggestions.length - 1
                                                    ? "1px solid"
                                                    : "none"
                                            }
                                            borderColor="border.muted"
                                            onMouseDown={() => {
                                                setQuery(p.name);
                                                setSuggestions([]);

                                                onChange({
                                                    target: {
                                                        name: "serviceInfo.partnerName",
                                                        value: p.name,
                                                    },
                                                });
                                            }}
                                        >
                                            {p.name}
                                        </Box>
                                    ))}
                                </Box>
                            )}

                            {debouncedQuery &&
                                suggestions.length === 0 &&
                                !loadingSuggestions && (
                                    <Box
                                        position="absolute"
                                        top="100%"
                                        left="0"
                                        right="0"
                                        mt={2}
                                        bg="bg.panel"
                                        border="1px solid"
                                        borderColor="border.muted"
                                        borderRadius="lg"
                                        zIndex={20}
                                        boxShadow="lg"
                                        px={3}
                                        py={2}
                                        fontSize="sm"
                                        color="fg.muted"
                                    >
                                        Ничего не найдено
                                    </Box>
                                )}
                        </Box>
                    </Field.Root>
                </FormSection>

                {/* Платёж */}
                <FormSection title="Детали платежа">
                    <Field.Root required>
                        <Field.Label fontSize="sm">
                            Сумма (в рублях)
                        </Field.Label>

                        <Input
                            type="number"
                            step="0.01"
                            name="serviceRequestAmount"
                            placeholder="0.00"
                            value={values.serviceRequestAmount}
                            onChange={onChange}
                        />
                    </Field.Root>
                </FormSection>

                <Button
                    type="submit"
                    colorPalette="blue"
                    loading={loading}
                    w="full"
                    size="lg"
                >
                    Оплатить
                </Button>
            </VStack>
        </Box>
    );
};

export default PayForm;