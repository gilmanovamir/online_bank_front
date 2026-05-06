import React, {useEffect, useState} from 'react';
import {
    VStack,
    Input,
    Button,
    Box,
    Field,
    NativeSelect,
    Heading
} from '@chakra-ui/react';
import {PartnerApi} from "../api";

// Вспомогательный компонент для секций формы
const FormSection = ({title, children}) => (
    <Box>
        <Heading size="sm" mb={3} color="gray.600">{title}</Heading>
        <VStack gap={4} align="stretch">
            {children}
        </VStack>
    </Box>
);

const PayForm = ({values, onChange, onSubmit, loading, accounts = []}) => {
    // Безопасный доступ к вложенным свойствам
    const senderAccount = values?.senderInfo?.accountNumberFrom || "";
    const serviceName = values?.serviceInfo?.partnerName || "";
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [selected, setSelected] = useState(false);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        if (!debouncedQuery || selected) return;

        setLoadingSuggestions(true);

        PartnerApi.findByContainingName(debouncedQuery)
            .then((data) => {
                setSuggestions(data);
            })
            .catch(() => setSuggestions([]))
            .finally(() => setLoadingSuggestions(false));
    }, [debouncedQuery, selected]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);

        return () => clearTimeout(timeout);
    }, [query]);

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


                <FormSection title="Данные отправителя">
                    <Field.Root required>
                        <Field.Label fontSize="sm">Счёт списания</Field.Label>
                        <NativeSelect.Root>
                            <NativeSelect.Field
                                name="senderInfo.accountNumberFrom"
                                value={senderAccount}
                                onChange={onChange}
                            >
                                <option value="">Выберите счёт списания</option>
                                {accounts.map((acc) => (
                                    <option key={acc.accountNumber} value={acc.accountNumber}>
                                        {acc.accountNumber} — {acc.balance} {acc.currencyCode}
                                    </option>
                                ))}
                            </NativeSelect.Field>
                        </NativeSelect.Root>
                    </Field.Root>
                </FormSection>

                <FormSection title="Данные отправителя">
                    <Field.Root required w="full">
                        <Field.Label fontSize="sm">Партнёр</Field.Label>

                        <Box position="relative" w="full">
                            <Input
                                w="full"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setSelected(false);
                                }}
                                onBlur={() => setTimeout(() => setSuggestions([]), 150)}
                                placeholder="Введите наименование сервиса"
                                autoComplete="off"
                            />

                            {suggestions.length > 0 && (
                                <Box
                                    position="absolute"
                                    top="100%"
                                    left="0"
                                    right="0"
                                    mt={2}
                                    bg="white"
                                    border="1px solid"
                                    borderColor="gray.200"
                                    borderRadius="lg"
                                    zIndex="20"
                                    boxShadow="lg"
                                    maxH="220px"
                                    overflowY="auto"
                                    w="full"
                                >
                                    {suggestions.map((p, index) => (
                                        <Box
                                            key={p.id}
                                            px={3}
                                            py={2}
                                            fontSize="sm"
                                            _hover={{bg: "gray.100"}}
                                            cursor="pointer"
                                            borderBottom={index !== suggestions.length - 1 ? "1px solid" : "none"}
                                            borderColor="gray.100"
                                            onMouseDown={() => {
                                                // setSelected(true)

                                                setQuery(p.name);
                                                setSuggestions([]);

                                                onChange({
                                                    target: {
                                                        name: "serviceInfo.partnerName",
                                                        value: p.name
                                                    }
                                                });
                                            }}
                                        >
                                            {p.name}
                                        </Box>
                                    ))}
                                </Box>
                            )}

                            {debouncedQuery && suggestions.length === 0 && !loadingSuggestions &&(
                                <Box
                                    position="absolute"
                                    top="100%"
                                    left="0"
                                    right="0"
                                    mt={2}
                                    bg="white"
                                    border="1px solid"
                                    borderColor="gray.200"
                                    borderRadius="lg"
                                    zIndex="20"
                                    boxShadow="lg"
                                    px={3}
                                    py={2}
                                    fontSize="sm"
                                    color="gray.400"
                                >
                                    Ничего не найдено
                                </Box>
                            )}
                        </Box>
                    </Field.Root>
                </FormSection>

                <FormSection title="Детали платежа">
                    <Field.Root required>
                        <Field.Label fontSize="sm">Сумма (в рублях)</Field.Label>
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
                    variant="outline"
                    alignSelf="flex-end"
                    type="submit"
                    colorPalette="blue"
                    loading={loading}
                    disabled={loading}
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