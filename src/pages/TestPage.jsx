import React, { useState } from "react";
import {
    Box,
    Button,
    Container,
    Heading,
    HStack,
    Input,
    Text,
    VStack,
    Alert,
    Field,
} from "@chakra-ui/react";

import { TestApi } from "../api";
import { getUserRole } from "../utils/authUtils";

// ─── Вспомогательный компонент вывода результата ─────────────────────────────

const ResultDisplay = ({ response }) => {
    if (!response) return null;

    return (
        <Box
            mt={5}
            p={4}
            bg="bg.panel"
            border="1px solid"
            borderColor="border.muted"
            borderRadius="lg"
        >
            <Heading size="sm" mb={3}>
                Результат
            </Heading>

            {response.type === "json" && (
                <Box
                    as="pre"
                    fontSize="sm"
                    whiteSpace="pre-wrap"
                    color="fg.default"
                >
                    {JSON.stringify(response.data, null, 2)}
                </Box>
            )}

            {response.type === "text" && (
                <Text color="fg.default">{response.data}</Text>
            )}

            {response.type === "email" && (
                <Text color="green.500">
                    ✓ {response.data || "Запрос обработан"}
                </Text>
            )}
        </Box>
    );
};

// ─── Основной компонент ───────────────────────────────────────────────────────

const TestPage = () => {
    const userRole = getUserRole();
    const isAdmin = userRole === "ROLE_ADMIN";

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);
    const [email, setEmail] = useState("");

    if (!isAdmin) return null;

    const execute = async (requestFn, resultType) => {
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const data = await requestFn();
            setResponse({ type: resultType, data });
        } catch (err) {
            setError(err.message || "Ошибка выполнения запроса");
        } finally {
            setLoading(false);
        }
    };

    const onEmailSubmit = (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setError("Введите email");
            return;
        }

        execute(() => TestApi.sendEmail(email), "email");
        setEmail("");
    };

    return (
        <Container maxW="lg" py={10}>
            <VStack gap={6} align="stretch">
                <Heading size="lg" textAlign="center">
                    Тестовая лаборатория
                </Heading>

                {/* API тесты */}
                <Box
                    bg="bg.panel"
                    p={5}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="border.muted"
                >
                    <Heading size="sm" mb={4}>
                        Проверка API
                    </Heading>

                    <HStack gap={3}>
                        <Button
                            onClick={() =>
                                execute(TestApi.test, "json")
                            }
                            loading={loading}
                            colorPalette="blue"
                            variant="outline"
                        >
                            API тест
                        </Button>

                        <Button
                            onClick={() =>
                                execute(TestApi.pureJava, "text")
                            }
                            loading={loading}
                            colorPalette="purple"
                            variant="outline"
                        >
                            Pure Java
                        </Button>
                    </HStack>
                </Box>

                {/* Email форма */}
                <Box bg="bg.panel" p={5} borderRadius="lg">
                    <Heading size="sm" mb={4}>
                        Тест почтового сервера
                    </Heading>

                    <form onSubmit={onEmailSubmit}>
                        <VStack align="stretch" gap={3}>
                            <Field.Root>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="test@example.com"
                                    disabled={loading}
                                />
                            </Field.Root>

                            <Button
                                type="submit"
                                colorPalette="green"
                                loading={loading}
                            >
                                Отправить OTP код
                            </Button>
                        </VStack>
                    </form>
                </Box>

                {/* Ошибка */}
                {error && (
                    <Alert.Root status="error" borderRadius="lg">
                        <Alert.Indicator />
                        <Alert.Content>
                            <Alert.Title>{error}</Alert.Title>
                        </Alert.Content>
                    </Alert.Root>
                )}

                {/* Результат */}
                <ResultDisplay response={response} />
            </VStack>
        </Container>
    );
};

export default TestPage;