import {useState} from "react";

export const usePayForm = () => {
    const initialState = {
        senderInfo: {
            name: '',
            surname: '',
            patronymic: '',
            accountNumberFrom: ''
        },
        serviceInfo: {
            partnerName: '',
            accountCurrencyCode: 'RUB'
        },
        serviceRequestAmount: '',
        category: 'FOOD',
    };

    const [values, setValues] = useState(initialState);

    const handleChange = (e) => {
        const {name, value} = e.target;

        // Если имя поля содержит точку, например "senderInfo.name"
        if (name.includes('.')) {
            const [section, field] = name.split('.');
            setValues(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        } else {
            // Для простых полей: category, serviceRequestAmount
            setValues(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const reset = () => setValues(initialState);

    return {values, handleChange, reset};
};