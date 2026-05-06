import React from "react";
import {
    VStack,
    Input,
    Button,
    Text,
    Field,
} from "@chakra-ui/react";

export const LoginSection = ({form, onChange, onLogin, loading}) => (
    <VStack gap={4} align="stretch">
        <Field.Root required>
            <Field.Label fontSize="sm">Email</Field.Label>
            <Input name="email" type="email" placeholder="test@gmail.com" value={form.email}
                   onChange={onChange}/>
        </Field.Root>

        <Field.Root required>
            <Field.Label fontSize="sm">Пароль</Field.Label>
            <Input name="password" type="password" placeholder="*****" value={form.password} onChange={onChange}/>
        </Field.Root>

        <Button colorPalette="blue" onClick={onLogin} loading={loading} w="full">
            Войти
        </Button>
    </VStack>
);

export const VerifySection = ({form, onChange, onVerify, onResend, loading}) => (
    <VStack gap={4} align="stretch" w="full" maxW="sm">
        <Text fontSize="sm" color="gray.600">
            Код отправлен на почту <Text as="b">{form.email}</Text>
        </Text>

        <Field.Root required>
            <Field.Label fontSize="sm">Код подтверждения</Field.Label>
            <Input name="verificationCode" placeholder="Введите код" value={form.verificationCode} onChange={onChange}/>
        </Field.Root>

        <Button colorPalette="green" onClick={onVerify} loading={loading} w="full">
            Подтвердить
        </Button>

        <Button variant="ghost" size="sm" onClick={onResend} loading={loading} colorPalette="blue">
            Отправить письмо повторно
        </Button>
    </VStack>
);