import React from 'react';

const Table = ({ headers, children }) => {
    return (
        <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
                <thead style={{textAlign: 'left'}}>
                    <tr>
                        {headers.map((head, index) => (
                            <th key={index}>{head}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {children}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
