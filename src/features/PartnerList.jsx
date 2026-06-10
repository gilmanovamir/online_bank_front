import React from "react";
import {
    Box,
    Heading,
    Text,
    Table,
} from "@chakra-ui/react";

import { formatCategory } from "../utils/localisation";

const PartnerList = ({ partners }) => {
    if (!partners || partners.length === 0) {
        return (
            <Text color="fg.muted">
                Список партнёров пуст.
            </Text>
        );
    }

    return (
        <Box>
            <Heading size="md" mb={4}>
                Текущие партнеры
            </Heading>

            <Table.ScrollArea>
                <Table.Root variant="outline" size="sm">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>
                                Название
                            </Table.ColumnHeader>
                            <Table.ColumnHeader>
                                Категория
                            </Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {partners.map((partner, index) => (
                            <Table.Row key={index}>
                                <Table.Cell>
                                    {partner.name}
                                </Table.Cell>

                                <Table.Cell color="fg.default">
                                    <Text fontSize="sm">
                                        {formatCategory(partner.category)}
                                    </Text>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Table.ScrollArea>
        </Box>
    );
};

export default PartnerList;