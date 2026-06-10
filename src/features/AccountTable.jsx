import {
    Table,
    Badge,
    Button,
    Text,
} from "@chakra-ui/react";

const AccountTable = ({accounts, onShowHistory}) => {
    if (!accounts?.length) return null;

    return (
        <Table.ScrollArea>
            <Table.Root variant="outline" size="sm">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>Номер счёта</Table.ColumnHeader>
                        <Table.ColumnHeader>Валюта</Table.ColumnHeader>
                        <Table.ColumnHeader>Баланс</Table.ColumnHeader>
                        <Table.ColumnHeader>Владелец</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">
                            Действие
                        </Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {accounts.map((acc) => (
                        <Table.Row key={acc.accountNumber}>
                            <Table.Cell>
                                <Text fontFamily="mono" fontSize="sm" color="fg.default">
                                    {acc.accountNumber}
                                </Text>
                            </Table.Cell>

                            <Table.Cell>
                                <Badge
                                    colorPalette="blue"
                                    variant="subtle"
                                >
                                    {acc.currencyCode}
                                </Badge>
                            </Table.Cell>

                            <Table.Cell fontWeight="medium" color="fg.default">
                                {Number(acc.balance).toLocaleString()}
                            </Table.Cell>

                            <Table.Cell color="fg.default">
                                {acc.holderName} {acc.holderSurname}
                            </Table.Cell>

                            <Table.Cell textAlign="center">
                                <Button
                                    size="xs"
                                    variant="outline"
                                    colorPalette="blue"
                                    onClick={() =>
                                        onShowHistory(acc.accountNumber)
                                    }
                                >
                                    История
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Table.ScrollArea>
    );
};

export default AccountTable;