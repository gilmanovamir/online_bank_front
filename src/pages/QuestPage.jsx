import React, { useEffect, useState } from "react";
import {
    VStack,
    Heading,
    Button,
    Alert,
    Box,
    Text,
} from "@chakra-ui/react";
import { QuestApi } from "../api";
import QuestList from "../features/QuestList";
import { getUserRole } from "../utils/authUtils";

const isAdminRole = (role) =>
    Array.isArray(role) ? role.includes("ROLE_ADMIN") : role === "ROLE_ADMIN";

const AdminPanel = ({ onGenerate, loading }) => (
    <Box
        p={4}
        bg="green.solid/10"
        borderRadius="xl"
        border="1px solid"
        borderColor="green.muted"
    >
        <Heading size="sm" color="green.fg" mb={3}>Панель управления (Админ)</Heading>
        <Button colorPalette="green" onClick={onGenerate} loading={loading} size="sm">
            Сгенерировать новый квест
        </Button>
    </Box>
);

const QuestPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [quests, setQuests] = useState([]);

    const isAdmin = isAdminRole(getUserRole());

    useEffect(() => {
        setLoading(true);
        QuestApi.getUserQuests()
            .then(setQuests)
            .catch(() => setError("Не удалось загрузить квесты"))
            .finally(() => setLoading(false));
    }, []);

    const handleCreateRandomQuest = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await QuestApi.createRandomQuest();
            setQuests(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const totalProgress = quests.reduce((sum, q) => sum + Number(q.userProgress || 0), 0);
    const sectionTitle = totalProgress === 0 ? "Доступные квесты" : "Текущий прогресс";

    return (
        <VStack gap={6} align="stretch" maxW="1000px" mx="auto">
            <Heading size="lg" textAlign="center">Квесты</Heading>

            {isAdmin && <AdminPanel onGenerate={handleCreateRandomQuest} loading={loading} />}

            {error && (
                <Alert.Root status="error" borderRadius="lg">
                    <Alert.Indicator />
                    <Alert.Content><Alert.Title>{error}</Alert.Title></Alert.Content>
                </Alert.Root>
            )}

            <Box>
                <Heading size="md" mb={2}>{sectionTitle}</Heading>
                {quests.length > 0
                    ? <QuestList quests={quests} />
                    : <Text color="fg.muted">У вас пока нет активных квестов. Загляните позже!</Text>
                }
            </Box>
        </VStack>
    );
};

export default QuestPage;
