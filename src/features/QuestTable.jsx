import {
    Table,
    Badge,
} from "@chakra-ui/react";

const QuestTable = ({quests}) => {
    if (!quests?.length) return null;

    return (
        <Table.ScrollArea mb={6}>
            <Table.Root variant="outline" size="sm">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>Название</Table.ColumnHeader>
                        <Table.ColumnHeader>Категория</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">Прогресс</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">Цель</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">Награда</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">Статус</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {quests.map((quest) => (
                        <Table.Row key={`${quest.name}-${quest.questExpireDate}`}>
                            <Table.Cell fontWeight="medium">{quest.name}</Table.Cell>
                            <Table.Cell>{quest.questCategory}</Table.Cell>
                            <Table.Cell textAlign="center">{quest.userProgress}</Table.Cell>
                            <Table.Cell textAlign="center">{quest.necessaryToReward}</Table.Cell>
                            <Table.Cell textAlign="center">{quest.pointReward}</Table.Cell>
                            <Table.Cell textAlign="center">
                                <Badge
                                    colorPalette={quest.isComplete ? "green" : "blue"}
                                    variant="subtle"
                                >
                                    {quest.isComplete ? "Завершён" : "В процессе"}
                                </Badge>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Table.ScrollArea>
    );
};

export default QuestTable;