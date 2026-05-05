import {
    VStack,
    Button,
    SimpleGrid,
    Box,
} from '@chakra-ui/react';

import {FormField} from "../components/FormField";

const FIELDS = [
    {
        name: 'name',
        label: 'Имя',
        placeholder: 'Иван',
        required: true,
        colSpan: 1,
    },
    {
        name: 'surname',
        label: 'Фамилия',
        placeholder: 'Иванов',
        required: true,
        colSpan: 1,
    },
    {
        name: 'patronymic',
        label: 'Отчество',
        placeholder: 'Иванович',
        required: false,
        colSpan: 2,
    },
    {
        name: 'phone',
        label: 'Телефон',
        placeholder: '+7 (999) 000-00-00',
        required: true,
        colSpan: 2,
    },
    {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'example@mail.ru',
        required: true,
        colSpan: 2,
    },
    {
        name: 'password',
        label: 'Пароль',
        type: 'password',
        placeholder: '*****',
        required: true,
        colSpan: 2,
    },
];

const RegistrationForm = ({values, onChange, onSubmit, onAdminSubmit, loading, showAdminButton}) => (
    <Box as="form" onSubmit={onSubmit}>
        <VStack gap={4} align="stretch">
            <SimpleGrid columns={2} gap={4}>
                {FIELDS.map((field) => (
                    <FormField
                        key={field.name}
                        field={field}
                        value={values[field.name]}
                        onChange={onChange}
                    />
                ))}
            </SimpleGrid>

            <VStack gap={3} pt={4}>
                <Button colorPalette="blue" type="submit" w="full" loading={loading}>
                    Зарегистрироваться
                </Button>

                {showAdminButton && (
                    <Button
                        variant="outline"
                        colorPalette="purple"
                        onClick={onAdminSubmit}
                        w="full"
                        loading={loading}
                    >
                        Регистрация администратора
                    </Button>
                )}
            </VStack>
        </VStack>
    </Box>
);

export default RegistrationForm;