import { useState, useEffect } from "react";
import {
    VStack,
    HStack,
    Box,
    Heading,
    Text,
    Input,
    Button,
    Alert,
    Badge,
    Table,
    Field,
} from "@chakra-ui/react";
import { BonusApi } from "../api";
import OperationTable from "../features/OperationTable";

// ─── Строка бонусного счёта с inline-конвертацией ────────────────────────────

const BonusRow = ({ account, onConvert, convertLoading }) => {
    const [points, setPoints] = useState("");

    const handleSubmit = () => {
        if (!points || Number(points) <= 0) return;
        onConvert(account.accountNumber, points);
        setPoints("");
    };

    return (
        <Table.Row>
            <Table.Cell>
                <Text fontFamily="mono" fontSize="sm">
                    {account.accountNumber}
                </Text>
            </Table.Cell>

            <Table.Cell>
                <HStack gap={1} align="baseline">
                    <Text fontWeight="bold" color="fg.default">
                        {Number(account.points).toLocaleString("ru-RU")}
                    </Text>

                    <Badge
                        colorPalette="blue"
                        variant="subtle"
                        fontSize="xs"
                    >
                        бонусов
                    </Badge>
                </HStack>
            </Table.Cell>

            <Table.Cell w="200px">
                <Field.Root>
                    <Input
                        type="number"
                        placeholder="Кол-во бонусов"
                        value={points}
                        onChange={(e) => setPoints(e.target.value)}
                        size="sm"
                        max={account.points}
                        min={1}
                    />
                </Field.Root>
            </Table.Cell>

            <Table.Cell>
                <Button
                    variant="outline"
                    alignSelf="flex-end"
                    size="sm"
                    colorPalette="blue"
                    onClick={handleSubmit}
                    loading={convertLoading}
                    disabled={!points || Number(points) <= 0}
                >
                    Конвертировать
                </Button>
            </Table.Cell>
        </Table.Row>
    );
};

// ─── Основной компонент ───────────────────────────────────────────────────────

const BonusPage = () => {
    const [accounts, setAccounts] = useState([]);
    const [accountsLoading, setAccountsLoading] = useState(true);
    const [accountsError, setAccountsError] = useState(null);

    const [result, setResult] = useState(null);
    const [convertLoading, setConvertLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadAccounts = async () => {
        setAccountsLoading(true);
        try {
            const data = await BonusApi.all();
            setAccounts(data);
        } catch {
            setAccountsError("Не удалось загрузить бонусные счета");
        } finally {
            setAccountsLoading(false);
        }
    };

    useEffect(() => {
        loadAccounts();
    }, []);

    const handleConvert = async (accountNumber, points) => {
        setConvertLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await BonusApi.convert({
                accountNumber,
                points: Number(points),
            });

            setResult(data);
            await loadAccounts();
        } catch (err) {
            setError(err.message);
        } finally {
            setConvertLoading(false);
        }
    };

    return (
        <VStack gap={6} align="stretch">
            <Heading size="lg" textAlign="center">
                Бонусный счёт
            </Heading>

            {accountsLoading && (
                <Text color="fg.muted" fontSize="sm">
                    Загрузка счетов...
                </Text>
            )}

            {accountsError && (
                <Alert.Root status="error" borderRadius="lg">
                    <Alert.Indicator />
                    <Alert.Content>
                        <Alert.Title>{accountsError}</Alert.Title>
                    </Alert.Content>
                </Alert.Root>
            )}

            {!accountsLoading && !accountsError && accounts.length === 0 && (
                <Box
                    p={6}
                    borderRadius="xl"
                    border="1px dashed"
                    borderColor="border.muted"
                    textAlign="center"
                >
                    <Text color="fg.muted">
                        У вас пока нет бонусных счетов
                    </Text>
                </Box>
            )}

            {accounts.length > 0 && (
                <Table.ScrollArea>
                    <Table.Root variant="outline" size="sm">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>
                                    Номер счёта
                                </Table.ColumnHeader>
                                <Table.ColumnHeader>
                                    Баланс
                                </Table.ColumnHeader>
                                <Table.ColumnHeader>
                                    Сумма конвертации
                                </Table.ColumnHeader>
                                <Table.ColumnHeader>
                                    Действие
                                </Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {accounts.map((acc) => (
                                <BonusRow
                                    key={acc.accountNumber}
                                    account={acc}
                                    onConvert={handleConvert}
                                    convertLoading={convertLoading}
                                />
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Table.ScrollArea>
            )}

            {error && (
                <Alert.Root status="error" borderRadius="lg">
                    <Alert.Indicator />
                    <Alert.Content>
                        <Alert.Title>{error}</Alert.Title>
                    </Alert.Content>
                </Alert.Root>
            )}

            {result && (
                <Box>
                    <Heading size="md" mb={4}>
                        Результат конвертации
                    </Heading>
                    <OperationTable operations={[result]} />
                </Box>
            )}
        </VStack>
    );
};

export default BonusPage;