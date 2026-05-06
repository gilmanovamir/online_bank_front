import {
    SimpleGrid,
    Box,
    VStack,
    HStack,
    Heading,
    Text,
    Badge,
    Progress,
} from "@chakra-ui/react";

const formatDate = (value) =>
    value ? new Date(value).toLocaleDateString("ru-RU") : "—";

const QuestCard = ({quest}) => {
    const progressPercent = Math.min(Number(quest.progressInPercent) || 0, 100);

    return (
        <Box
            p={5}
            borderRadius="xl"
            border="1px solid"
            borderColor={quest.isComplete ? "green.200" : "gray.200"}
            bg={quest.isComplete ? "green.50" : "white"}
            position="relative"
        >
            {quest.isComplete && (
                <Badge
                    colorPalette="green"
                    variant="solid"
                    position="absolute"
                    top={3}
                    right={3}
                >
                    Выполнено ✓
                </Badge>
            )}

            <VStack align="stretch" gap={3}>
                <Heading size="sm" pr={quest.isComplete ? 24 : 0}>{quest.name}</Heading>

                <Text fontSize="sm" color="gray.600">
                    Категория: <Text as="b" color="gray.800">{quest.questCategory}</Text>
                </Text>

                <Box>
                    <HStack justify="space-between" mb={1}>
                        <Text fontSize="xs" color="gray.500">
                            Прогресс: {quest.userProgress} / {quest.necessaryToReward}
                        </Text>
                        <Text fontSize="xs" color="gray.500">{Math.floor(progressPercent)}%</Text>
                    </HStack>
                    <Progress.Root
                        value={progressPercent}
                        size="sm"
                        colorPalette={quest.isComplete ? "green" : "blue"}
                        borderRadius="full"
                    >
                        <Progress.Track borderRadius="full">
                            <Progress.Range/>
                        </Progress.Track>
                    </Progress.Root>
                </Box>

                <Text fontSize="xs" color="gray.400">
                    Истекает: {formatDate(quest.questExpireDate)}
                </Text>
            </VStack>
        </Box>
    );
};

const QuestList = ({quests}) => {
    if (!quests?.length) return null;

    return (
        <SimpleGrid columns={{base: 1, md: 2}} gap={4} mt={4}>
            {quests.map((quest) => (
                <QuestCard key={`${quest.name}-${quest.questExpireDate}`} quest={quest}/>
            ))}
        </SimpleGrid>
    );
};

export default QuestList;