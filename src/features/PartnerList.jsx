import React from "react";

const PartnerList = ({partners}) => {
    if (!partners || partners.length === 0) {
        return <p>Список партнёров пуст.</p>;
    }


    return (
        <div className="partner-list">
            <h3>Текущие партнеры</h3>
            <table
                style={{width: `100%`, borderCollapse: `collapse`, marginTop: `10px`}}>
                <thead>
                <tr style={{backgroundColor: `#f4f4f4`, textAlign: `left`}}>
                    <th style={{padding: `10px`, border: `1px solid #ddd`}}>Название</th>
                    <th style={{padding: `10px`, border: `1px solid #ddd`}}>Категория</th>
                </tr>
                </thead>
                <tbody>
                {partners.map((partner, index) => (
                    <tr key={index}>
                        <td style={{padding: `10px`, border: `1px solid #ddd`}}>
                            {partner.name}
                        </td>
                        <td style={{padding: '10px', border: '1px solid #ddd'}}>
                            {(partner.category)}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
export default PartnerList;
