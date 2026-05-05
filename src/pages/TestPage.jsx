import React, {useState} from 'react';
import {TestApi} from '../api';

import {getUserRole} from "../utils/authUtils";

const TestPage = () => {
    const userRole = getUserRole();
    const isAdmin = userRole === "ROLE_ADMIN";
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);
    const [email, setEmail] = useState('');

    if (!isAdmin) {
        return null;
    }

    // Универсальная обертка для запросов
    const execute = async (requestFn, resultType) => {
        setLoading(true);
        setError(null);
        setResponse(null);
        try {
            const data = await requestFn();
            setResponse({type: resultType, data});
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const onEmailSubmit = (e) => {
        e.preventDefault();
        if (!email.trim()) return setError('Введите email');
        execute(() => TestApi.sendEmail(email), 'email');
        setEmail('');
    };

    return (
        <div className="component-container">
            <h2>Тестовая лаборатория</h2>

            {/* Секция кнопок */}
            <section style={{marginBottom: '30px'}}>
                <h3>Проверка API</h3>
                <div style={{display: 'flex', gap: '10px'}}>
                    <button onClick={() => execute(TestApi.test, 'json')} disabled={loading}>
                        Выполнить API Тест
                    </button>
                    <button onClick={() => execute(TestApi.pureJava, 'text')} disabled={loading}>
                        Pure Java Тест
                    </button>
                </div>
            </section>

            {/* Форма отправки Email */}
            <form onSubmit={onEmailSubmit} style={{marginBottom: '30px', maxWidth: '400px'}}>
                <h3>Тест почтового сервера</h3>
                <div className="form-group">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="test@example.com"
                        required
                        disabled={loading}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Отправка...' : 'Отправить OTP код'}
                </button>
            </form>

            {/* Вывод ошибок и результатов */}
            {error && <div className="error-message" style={{color: 'red'}}>Ошибка: {error}</div>}

            <ResultDisplay response={response}/>
        </div>
    );
};

// Вспомогательный компонент для отображения разных типов данных
const ResultDisplay = ({response}) => {
    if (!response) return null;

    return (
        <div className="data-display" style={{marginTop: '20px', padding: '15px', background: '#f9f9f9'}}>
            <h3>Результат:</h3>
            {response.type === 'json' && <pre>{JSON.stringify(response.data, null, 2)}</pre>}
            {response.type === 'text' && <p>{response.data}</p>}
            {response.type === 'email' && <p style={{color: 'green'}}>✓ {response.data || 'Запрос обработан'}</p>}
        </div>
    );
};

export default TestPage;