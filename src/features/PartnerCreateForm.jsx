import React from "react";
import {
    Box,
    Button,
    Heading,
    Input,
    VStack,
    Field,
    NativeSelect,
} from "@chakra-ui/react";

import {PARTNER_CATEGORIES} from "../model/constants";

const PartnerCreateForm = ({values, onChange, onSubmit, loading}) => (
    <Box
        as="form"
        onSubmit={onSubmit}
        maxW="500px"
        bg="bg.panel"
        p={5}
        borderRadius="lg"
        border="1px solid"
        borderColor="border.muted"
    >
        <VStack align="stretch" gap={4}>
            <Heading size="md">
                Создать нового партнера (ADMIN)
            </Heading>

            <Field.Root required>
                <Field.Label fontSize="sm">
                    Название партнера
                </Field.Label>

                <Input
                    name="name"
                    type="text"
                    value={values.name}
                    onChange={onChange}
                    placeholder="Например: Монеточка"
                    disabled={loading}
                />
            </Field.Root>

            <Field.Root>
                <Field.Label fontSize="sm">
                    Категория
                </Field.Label>

                <NativeSelect.Root>
                    <NativeSelect.Field
                        name="category"
                        value={values.category}
                        onChange={onChange}
                        disabled={loading}
                    >
                        {PARTNER_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </NativeSelect.Field>

                    <NativeSelect.Indicator/>
                </NativeSelect.Root>
            </Field.Root>

            <Button
                type="submit"
                colorPalette="blue"
                loading={loading}
                w="full"
            >
                {loading ? "Создание..." : "Создать партнера"}
            </Button>
        </VStack>
    </Box>
);

export default PartnerCreateForm;