export const PARTNER_CATEGORY_LABELS = {
    FOOD: "Еда и рестораны",
    ENTERTAINMENT: "Развлечения",
    MEDICINE: "Медицина",
};

// Функция-хелпер, чтобы если с бэка прилетит что-то новое, приложение не падало, а выводило сырой энам
export const formatCategory = (category) => {
    return PARTNER_CATEGORY_LABELS[category] || category;
};