import {SimpleGrid, Box, VStack, HStack, Heading, Text, Badge, Progress} from "@chakra-ui/react";
import {formatCategory} from "../utils/localisation";

const formatDate = (value) =>
    value ? new Date(value).toLocaleDateString("ru-RU") : "—";

const QuestCard = ({quest}) => {
    const progressPercent = Math.min(Number(quest.progressInPercent) || 0, 100);

    return (
        <Box
            p={5}
            borderRadius="xl"
            border="1px solid"
            // Используем более нейтральные цвета границ
            borderColor={quest.isComplete ? "green.solid" : "border.muted"}
            bg={quest.isComplete ? "bg.success.subtle" : "bg.panel"}
            position="relative"
            shadow="sm"
        >
            {quest.isComplete && (
                <Badge
                    colorPalette="green"
                    variant="solid"
                    position="absolute"
                    top={3}
                    right={3}
                >
                    Выполнено
                </Badge>
            )}

            <VStack align="stretch" gap={3}>
                <Heading size="sm" pr={quest.isComplete ? 24 : 0}>{quest.name}</Heading>

                <Text fontSize="sm" color="fg.muted">
                    {/* ПОДМЕНЯЕМ ТУТ */}
                    Категория: <Text as="b" color="fg.default">{formatCategory(quest.questCategory)}</Text>
                </Text>

                <Box>
                    <HStack justify="space-between" mb={1}>
                        <Text fontSize="xs" color="fg.muted">
                            Прогресс: {quest.userProgress} / {quest.necessaryToReward}
                        </Text>
                        <Text fontSize="xs" color="fg.muted">{Math.floor(progressPercent)}%</Text>
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

                <Text fontSize="xs" color="fg.subtle">
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