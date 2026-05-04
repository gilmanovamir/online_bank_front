import React from 'react';
import {
    VStack,
    Input,
    Button,
    Box,
    Field,
    Heading,
    NativeSelect,
} from '@chakra-ui/react';
import { PARTNER_CATEGORIES } from "../model/constants";

// Вспомогательный компонент для секций формы
const FormSection = ({ title, children }) => (
    <Box>
        <Heading size="sm" mb={3} color="gray.600">{title}</Heading>
        <VStack gap={4} align="stretch">
            {children}
        </VStack>
    </Box>
);

const PayForm = ({ values, onChange, onSubmit, loading, accounts = [] }) => {
    // Безопасный доступ к вложенным свойствам
    const senderAccount = values?.senderInfo?.accountNumberFrom || "";
    const serviceName = values?.serviceInfo?.partnerName || "";

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

                <FormSection title="Информация об услуге">
                    <Field.Root required>
                        <Field.Label fontSize="sm">Название сервиса</Field.Label>
                        <Input
                            name="serviceInfo.partnerName"
                            placeholder="Например: Ростелеком"
                            value={serviceName}
                            onChange={onChange}
                        />
                    </Field.Root>
                </FormSection>

                <FormSection title="Детали платежа">
                    <Field.Root required>
                        <Field.Label fontSize="sm">Сумма</Field.Label>
                        <Input
                            type="number"
                            step="0.01"
                            name="serviceRequestAmount"
                            placeholder="0.00"
                            value={values.serviceRequestAmount}
                            onChange={onChange}
                        />
                    </Field.Root>

                    {/*<Field.Root>*/}
                    {/*    <Field.Label fontSize="sm">Категория</Field.Label>*/}
                    {/*    <NativeSelect.Root>*/}
                    {/*        <NativeSelect.Field*/}
                    {/*            name="category"*/}
                    {/*            value={values.category}*/}
                    {/*            onChange={onChange}*/}
                    {/*        >*/}
                    {/*            {PARTNER_CATEGORIES.map((c) => (*/}
                    {/*                <option key={c} value={c}>{c}</option>*/}
                    {/*            ))}*/}
                    {/*        </NativeSelect.Field>*/}
                    {/*    </NativeSelect.Root>*/}
                    {/*</Field.Root>*/}
                </FormSection>

                <Button
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