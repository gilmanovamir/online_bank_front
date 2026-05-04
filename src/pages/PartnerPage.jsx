import React, {useEffect, useState} from 'react';
import {PartnerApi} from '../api';
import {useForm} from '../hooks/useForm';
import PartnerCreateForm from '../features/PartnerCreateForm';
import PartnerList from "../features/PartnerList";
import { getUserRole } from "../utils/authUtils"; // 1. Импортируем утилиту

const PartnerPage = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // 2. Получаем роль и проверяем на админа
    const userRole = getUserRole();
    const isAdmin = Array.isArray(userRole)
        ? userRole.includes("ROLE_ADMIN")
        : userRole === "ROLE_ADMIN";

    const {values, handleChange, reset} = useForm({
        name: '',
        category: 'MEDICINE',
    });

    const fetchPartners = async () => {
        try {
            const data = await PartnerApi.getAllPartners();
            setPartners(data);
        } catch (err) {
            console.error("Не удалось загрузить партнеров", err);
        }
    }

    useEffect(() => {
        fetchPartners();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await PartnerApi.createPartner(values);
            setSuccess(true);
            reset();
            fetchPartners();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="component-container">
            <h2>Партнеры банка</h2>

            {/* 3. Форму создания показываем ТОЛЬКО админу */}
            {isAdmin && (
                <div style={{
                    marginBottom: '30px',
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #dee2e6'
                }}>
                    <h3 style={{marginTop: 0}}>Добавить нового партнера</h3>
                    <PartnerCreateForm
                        values={values}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        loading={loading}
                    />
                    {error && <div className="error-message" style={{color: 'red', marginTop: '10px'}}>Ошибка: {error}</div>}
                    {success && (
                        <div className="success-message" style={{color: 'green', marginTop: '15px'}}>
                            ✓ Партнер успешно создан!
                        </div>
                    )}
                </div>
            )}

            {/* Вывод списка партнеров (виден всем) */}
            <PartnerList partners={partners}/>

            {/* 4. Админское примечание скрываем полностью от обычных пользователей */}
            {isAdmin && (
                <div className="admin-note" style={{marginTop: '30px', padding: '15px', border: '1px solid #eee', color: '#666'}}>
                    <p><strong>Панель администратора:</strong> Вы можете добавлять партнеров, которые будут отображаться в общем списке для всех клиентов банка.</p>
                </div>
            )}
        </div>
    );
};

export default PartnerPage;