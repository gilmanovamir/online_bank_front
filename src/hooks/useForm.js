import {useState} from "react";

export const useForm = (initialState) => {
    const [values, setValues] = useState(initialState);

    const handleChange = (e) => {
        const {name, value} = e.target;

        // Если в имени есть точка (например, "senderInfo.name")
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setValues(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            // Обычное поведение для плоских полей
            setValues(prev => ({...prev, [name]: value}));
        }
    };

    const reset = () => setValues(initialState);

    return {values, handleChange, reset, setValues};
};