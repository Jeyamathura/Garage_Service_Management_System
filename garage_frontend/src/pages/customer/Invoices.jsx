import React, { useEffect, useState } from 'react';
import { getInvoices } from '../../api/invoice.api';
import Table from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';

const MyInvoices = () => {
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const data = await getInvoices();
            setInvoices(data);
        } catch (error) {
            console.error("Failed to fetch invoices", error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="mb-4">My Invoices</h1>
            <Table headers={['Service', 'Amount', 'Date', 'Status']}>
                {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                        <td>{invoice.booking?.service?.service_name || 'N/A'}</td>
                        <td>Rs. {parseFloat(invoice.total_amount).toFixed(2)}</td>
                        <td>{invoice.invoice_date}</td>
                        <td><StatusBadge status={invoice.payment_status} /></td>
                    </tr>
                ))}
            </Table>
        </div>
    );
};

export default MyInvoices;
