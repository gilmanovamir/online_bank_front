import {
    VStack,
    Button,
    Field,
    NativeSelect,
} from "@chakra-ui/react";

const CURRENCIES = ["USD", "RUB", "CNY"];

const AccountCreateForm = ({currencyCode, setCurrencyCode, onCreate, loading}) => (
    <VStack gap={4} align="stretch">
        <Field.Root>
            <Field.Label fontSize="sm">Валюта</Field.Label>
            <NativeSelect.Root>
                <NativeSelect.Field value={currencyCode} onChange={(e) => setCurrencyCode(e.target.value)}>
                    {CURRENCIES.map((code) => (
                        <option bg="bg.panel" key={code} value={code}>{code}</option>
                    ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator/>
            </NativeSelect.Root>
        </Field.Root>
        <Button variant="outline" alignSelf="flex-end" colorPalette="blue" onClick={onCreate} loading={loading}
                w="full">
            Создать счёт
        </Button>
    </VStack>
);

export default AccountCreateForm;