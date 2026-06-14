import {useState} from "react";
import {
    Table,
    Badge,
    Text,
    Button
} from "@chakra-ui/react";
import {ReceiptApi} from "../api";

const OPERATION_TYPE_MAP = {
    DEPOSIT: {label: "Пополнение", colorPalette: "blue"},
    WITHDRAW: {label: "Списание", colorPalette: "red"},
    BUY_CURRENCY: {label: "Обмен", colorPalette: "blue"},
};

const OperationBadge = ({type}) => {
    const config =
        OPERATION_TYPE_MAP[type] ?? {
            label: type,
            colorPalette: "gray",
        };

    return (
        <Badge colorPalette={config.colorPalette} variant="subtle">
            {config.label}
        </Badge>
    );
};

const formatDate = (value) =>
    value ? new Date(value).toLocaleString("ru-RU") : "—";

const OperationTable = ({operations}) => {
    const [downloadingId, setDownloadingId] = useState(null);

    const handleDownloadReceipt = async (id) => {
        setDownloadingId(id);
        try {
            const blobData = await ReceiptApi.getReceipt(id);
            console.log(blobData)

            const file = new Blob([blobData], {type: "application/pdf"});
            const fileURL = URL.createObjectURL(file);

            const link = document.createElement("a");
            link.href = fileURL;
            link.setAttribute("download", `receipt-${id}.pdf`);

            document.body.appendChild(link);
            link.click();

            link.remove();
            URL.revokeObjectURL(fileURL);
        } catch (error) {
            alert("Не удалось скачать чек: " + error.message);
        } finally {
            setDownloadingId(null);
        }
    };

    if (!operations?.length)
        return (
            <Text color="fg.muted">
                Операций пока нет
            </Text>
        );

    return (
        <Table.ScrollArea>
            <Table.Root variant="outline" size="sm">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader textAlign="center">Дата Операции</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">Тип</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">Описание</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="left">Валюта</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="right">Сумма</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">Чек</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {operations.map((op) => {
                        const id = op.operationId ?? op.id;

                        return (
                            <Table.Row key={id}>

                                <Table.Cell fontSize="sm" color="fg.muted" textAlign="center">
                                    {formatDate(op.createdAt)}
                                </Table.Cell>

                                <Table.Cell textAlign="center">
                                    <OperationBadge type={op.operationType}/>
                                </Table.Cell>

                                <Table.Cell color="fg.default">
                                    {op.description ?? "—"}
                                </Table.Cell>

                                <Table.Cell>
                                    <Badge variant="subtle" colorPalette="blue" textAlign="right">
                                        {op.currencyCode}
                                    </Badge>
                                </Table.Cell>

                                <Table.Cell color="fg.default" textAlign="right">
                                    {Number(op.amount).toLocaleString()}
                                </Table.Cell>

                                <Table.Cell textAlign="center">
                                    <Button
                                        size="xs"
                                        variant="outline"
                                        colorPalette="blue"
                                        loading={downloadingId === id}
                                        onClick={() => handleDownloadReceipt(id)}
                                    >
                                        Скачать
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table.Root>
        </Table.ScrollArea>
    );
};

export default OperationTable;