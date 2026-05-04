import {useState} from "react";

export const useOperationForm = () => {
    const [form, setForm] = useState({
        accountNumber: "", providedAmountInBaseCurrency: "", description: "", selectedCurrencyCode: "RUB",
    });

    const handleChange = (e) => {
        setForm(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    return {form, handleChange};
};