import React, { useEffect, useState } from 'react';
import {
    Box,
    Heading,
    Text,
    Alert,
    VStack
} from '@chakra-ui/react'; // Импортируем компоненты Chakra
import { PartnerApi } from '../api';
import { useForm } from '../hooks/useForm';
import PartnerCreateForm from '../features/PartnerCreateForm';
import PartnerList from "../features/PartnerList";
import { getUserRole } from "../utils/authUtils";

const PartnerPage = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const userRole = getUserRole();
    const isAdmin = Array.isArray(userRole)
        ? userRole.includes("ROLE_ADMIN")
        : userRole === "ROLE_ADMIN";

    const { values, handleChange, reset } = useForm({
        name: '',
        category: 'MEDICINE',
    });

    const fetchPartners = async () => {
        try {
            const data = await PartnerApi.getAllPartners();
            setPartners(data);
        } catch (err) {
            console.error("Не удалось загрузить партнеров", err);
        }
    };

    useEffect(() => {
        fetchPartners();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await PartnerApi.createPartner(values);
            setSuccess(true);
            reset();
            fetchPartners();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <VStack gap={6} align="stretch" maxW="1000px" mx="auto">
            <Heading size="lg" textAlign="center">Партнеры банка</Heading>

            {isAdmin && (
                <Box
                    p={5}
                    bg="bg.panel"
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="border.muted"
                >
                    <Heading size="sm" mb={4}>Добавить нового партнера</Heading>

                    <PartnerCreateForm
                        values={values}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        loading={loading}
                    />

                    {error && (
                        <Alert.Root status="error" borderRadius="lg" mt={4}>
                            <Alert.Indicator />
                            <Alert.Content>
                                <Alert.Title>Ошибка: {error}</Alert.Title>
                            </Alert.Content>
                        </Alert.Root>
                    )}

                    {success && (
                        <Alert.Root status="success" borderRadius="lg" mt={4}>
                            <Alert.Indicator />
                            <Alert.Content>
                                <Alert.Title>Партнер успешно создан!</Alert.Title>
                            </Alert.Content>
                        </Alert.Root>
                    )}
                </Box>
            )}

            {/* Вывод списка партнеров (виден всем) */}
            <PartnerList partners={partners} />

            {/* Админское примечание скрываем полностью от обычных пользователей */}
            {isAdmin && (
                /* ИСПРАВЛЕНО: Адаптивный Box с цветом текста fg.muted вместо жесткого #666 */
                <Box
                    p={4}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="border.muted"
                    bg="bg.muted"
                >
                    <Text fontSize="sm" color="fg.muted">
                        <strong>Панель администратора:</strong> Вы можете добавлять партнеров, которые будут отображаться в общем списке для всех клиентов банка.
                    </Text>
                </Box>
            )}
        </VStack>
    );
};

export default PartnerPage;
