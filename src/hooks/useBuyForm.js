import {useState} from "react";

export const useBuyForm = () => { // 2. Хук — это функция
    // 3. Создаем состояние внутри
    const [buyForm, setBuyForm] = useState({
        baseAccountNumber: "",
        targetAccountNumber: "",
        providedAmountInBaseCurrency: "",
    });

    // 4. Логика изменения (handleChange) должна быть внутри хука
    const handleBuyChange = (e) => {
        const {name, value} = e.target;
        setBuyForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // 5. Возвращаем объект или массив с данными и функцией
    return {buyForm, handleBuyChange, setBuyForm};
};