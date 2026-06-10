import React, { useState } from "react";
import {
    Box,
    Button,
    Container,
    Heading,
    Input,
    Text,
    VStack,
    Alert,
    Field,
} from "@chakra-ui/react";
import { CodeApi } from "../api";

// ─── Подкомпонент статусов ───────────────────────────────────────────────────

const StatusMessages = ({ error, success, result }) => (
    <VStack align="stretch" mt={5} gap={3}>
        {error && (
            <Alert.Root status="error" borderRadius="lg">
                <Alert.Indicator />
                <Alert.Content>
                    <Alert.Title>{error}</Alert.Title>
                </Alert.Content>
            </Alert.Root>
        )}

        {success && (
            <Alert.Root status="success" borderRadius="lg">
                <Alert.Indicator />
                <Alert.Content>
                    <Alert.Title>{success}</Alert.Title>
                </Alert.Content>
            </Alert.Root>
        )}

        {result && (
            <Box
                bg="bg.panel"
                border="1px solid"
                borderColor="border.muted"
                borderRadius="lg"
                p={4}
            >
                <Heading size="sm" mb={2}>
                    Полученный код
                </Heading>
                <Box
                    as="pre"
                    fontSize="sm"
                    color="fg.muted"
                    whiteSpace="pre-wrap"
                >
                    {result}
                </Box>
            </Box>
        )}
    </VStack>
);

// ─── Основной компонент ───────────────────────────────────────────────────────

const CodePage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [email, setEmail] = useState("");
    const [regenerateResult, setRegenerateResult] = useState("");

    const execute = async (requestFn, successMsg, callback) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const result = await requestFn();
            setSuccess(successMsg);

            if (callback) callback(result);
        } catch (err) {
            setError(err.message || "Ошибка выполнения запроса");
        } finally {
            setLoading(false);
        }
    };

    const onDeleteOld = () => {
        if (window.confirm("Удалить все старые коды? Это необратимо.")) {
            execute(
                CodeApi.deleteOldCodes,
                "Старые коды успешно удалены"
            );
        }
    };

    const onRegenerate = (e) => {
        e.preventDefault();

        execute(
            () => CodeApi.regenerateOtp(email),
            "OTP код успешно перегенерирован",
            (result) => {
                setRegenerateResult(result);
                setEmail("");
            }
        );
    };

    return (
        <Container maxW="lg" py={10}>
            <VStack gap={6} align="stretch">
                <Heading size="lg" textAlign="center">
                    Управление Verification кодами
                </Heading>

                {/* Администрирование */}
                <Box
                    bg="bg.panel"
                    p={5}
                    borderRadius="lg"
                    border="1px dashed"
                    borderColor="border.muted"
                >
                    <Heading size="sm" mb={4}>
                        Администрирование
                    </Heading>

                    <Button
                        colorPalette="red"
                        variant="outline"
                        onClick={onDeleteOld}
                        loading={loading}
                    >
                        Очистить старые коды
                    </Button>

                    <Text mt={2} fontSize="sm" color="fg.muted">
                        Очистка кодов доступна только для ADMIN
                    </Text>
                </Box>

                {/* Перегенерация OTP */}
                <Box bg="bg.panel" p={5} borderRadius="lg">
                    <Heading size="sm" mb={4}>
                        Перегенерация OTP
                    </Heading>

                    <form onSubmit={onRegenerate}>
                        <VStack align="stretch" gap={3}>
                            <Field.Root>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="user@example.com"
                                    disabled={loading}
                                />
                            </Field.Root>

                            <Button
                                type="submit"
                                colorPalette="blue"
                                loading={loading}
                            >
                                Отправить новый код
                            </Button>
                        </VStack>
                    </form>
                </Box>

                {/* Статусы */}
                <StatusMessages
                    error={error}
                    success={success}
                    result={regenerateResult}
                />
            </VStack>
        </Container>
    );
};

export default CodePage;