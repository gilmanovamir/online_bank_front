import React from 'react';
import {PARTNER_CATEGORIES} from "../model/constants";

const PartnerCreateForm = ({values, onChange, onSubmit, loading}) => (
    <form onSubmit={onSubmit} style={{maxWidth: '500px'}}>
        <h3>Создать нового партнера (ADMIN)</h3>

        <div className="form-group">
            <label>Название партнера:</label>
            <input
                name="name"
                type="text"
                value={values.name}
                onChange={onChange}
                placeholder="Например: Монеточка"
                required
                disabled={loading}
            />
        </div>

        <div className="form-group">
            <label>Категория:</label>
            <select
                name="category"
                value={values.category}
                onChange={onChange}
                disabled={loading}
            >
                {PARTNER_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
        </div>

        <button type="submit" disabled={loading}>
            {loading ? 'Создание...' : 'Создать партнера'}
        </button>
    </form>
);

export default PartnerCreateForm;