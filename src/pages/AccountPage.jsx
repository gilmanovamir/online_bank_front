import {AccountApi, OperationApi} from "../api";
import {useAccountForm} from "../hooks/useAccountForm";
import AccountCreateForm from "../features/AccountCreateForm";
import AccountTable from "../features/AccountTable";
import OperationTable from "../features/OperationTable";
import React, {useEffect, useState} from "react";
import { getUserRole } from "../utils/authUtils";


const userRole = getUserRole();

const AccountPage = () => {
    const {currencyCode, setCurrencyCode} = useAccountForm();

    const [accounts, setAccounts] = useState([]);
    const [operations, setOperations] = useState([]);
    const [selectedAcc, setSelectedAcc] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = async (apiFunc, successCallback) => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiFunc();
            if (successCallback) successCallback(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Загрузка счетов при входе на страницу
    useEffect(() => {
        request(AccountApi.findAllByHolder, setAccounts);
    }, []);

    const handleShowHistory = (accNum) => {
        setSelectedAcc(accNum);
        request(
            () => OperationApi.findAllByAccountNumber(accNum, 0, 10),
            (data) => setOperations(data)
        );
    };

    const handleCreateAccount = () => {
        request(
            () => AccountApi.createAccount(currencyCode),
            (data) => {
                alert(`Счет ${data.accountNumber} успешно открыт!`);
                // Обновляем список, чтобы новый счет появился в таблице с балансом
                request(AccountApi.findAllByHolder, setAccounts);
            }
        );
    };

    return (
        <div className="container">
            <h2>Мои счета</h2>

            {/* Секция создания счета */}
            <div className="card" style={{ marginBottom: '20px' }}>
                <AccountCreateForm
                    currencyCode={currencyCode}
                    setCurrencyCode={setCurrencyCode}
                    onCreate={handleCreateAccount}
                    loading={loading}
                />
            </div>

            {/* Основная таблица счетов */}
            <section className="accounts-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Список активных счетов</h3>
                    {/*<button*/}
                    {/*    className="btn-refresh"*/}
                    {/*    onClick={() => request(AccountApi.findAllByHolder, setAccounts)}*/}
                    {/*>*/}
                    {/*    Обновить данные*/}
                    {/*</button>*/}
                </div>

                {accounts.length > 0 ? (
                    <AccountTable accounts={accounts} onShowHistory={handleShowHistory}/>
                ) : (
                    <div className="empty-state">У вас пока нет открытых счетов.</div>
                )}
            </section>

            {error && <p className="error-message">{error}</p>}
            {loading && <p className="loading-spinner">Обработка запроса...</p>}

            {/* История операций (появляется под таблицей счетов) */}
            {selectedAcc && (
                <section className="history-section" style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px solid #eee' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h3>История по счету: <span style={{ color: '#007bff' }}>{selectedAcc}</span></h3>
                        {/*<button className="btn-close" onClick={() => setSelectedAcc(null)}>Закрыть X</button>*/}
                    </div>
                    {operations.length > 0 ? (
                        <OperationTable operations={operations}/>
                    ) : (
                        <p className="no-data">Операций по этому счету не найдено.</p>
                    )}
                </section>
            )}
        </div>
    );
};

export default AccountPage;