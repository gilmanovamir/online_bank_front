import {
    Table,
    Badge,
    Text,
} from "@chakra-ui/react";

const OPERATION_TYPE_MAP = {
    DEPOSIT: {label: "Пополнение", colorPalette: "blue"},
    WITHDRAW: {label: "Снятие", colorPalette: "red"},
};

const OperationBadge = ({type}) => {
    const config = OPERATION_TYPE_MAP[type] ?? {label: type, colorPalette: "gray"};
    return <Badge colorPalette={config.colorPalette} variant="subtle">{config.label}</Badge>;
};

const formatDate = (value) =>
    value ? new Date(value).toLocaleString("ru-RU") : "—";

const OperationTable = ({operations}) => {
    if (!operations?.length) return <Text color="gray.500">Операций пока нет</Text>;

    return (
        <Table.ScrollArea>
            <Table.Root variant="outline" size="sm">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>Номер счёта</Table.ColumnHeader>
                        <Table.ColumnHeader>Дата</Table.ColumnHeader>
                        <Table.ColumnHeader>ID</Table.ColumnHeader>
                        <Table.ColumnHeader>Тип</Table.ColumnHeader>
                        <Table.ColumnHeader>Описание</Table.ColumnHeader>
                        <Table.ColumnHeader>Валюта</Table.ColumnHeader>
                        <Table.ColumnHeader>Сумма</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {operations.map((op) => {
                        const id = op.operationId ?? op.id;
                        return (
                            <Table.Row key={id}>

                                <Table.Cell>
                                    <Text fontFamily="mono" fontSize="sm">{op.accountNumber}</Text>
                                </Table.Cell>
                                <Table.Cell color="gray.600" fontSize="sm">{formatDate(op.createdAt)}</Table.Cell>
                                <Table.Cell>
                                    <Text fontFamily="mono" fontSize="xs" color="gray.500">{id}</Text>
                                </Table.Cell>
                                <Table.Cell><OperationBadge type={op.operationType}/></Table.Cell>
                                <Table.Cell>{op.description ?? "—"}</Table.Cell>
                                <Table.Cell>
                                    <Badge variant="outline" colorPalette="blue">{op.currencyCode}</Badge>
                                </Table.Cell>
                                <Table.Cell>{op.amount}</Table.Cell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table.Root>
        </Table.ScrollArea>
    );
};

export default OperationTable;