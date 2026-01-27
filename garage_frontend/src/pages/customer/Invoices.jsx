import React, { useEffect, useState } from 'react';
import { getInvoices } from '../../api/invoice.api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { FileText, Calendar, Search } from 'lucide-react';

const MyInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const data = await getInvoices();
            setInvoices(data);
        } catch (error) {
            console.error("Failed to fetch invoices", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredInvoices = invoices.filter(invoice => {
        const searchLower = searchQuery.toLowerCase();
        const serviceName = invoice.booking?.service?.service_name?.toLowerCase() || "";
        return serviceName.includes(searchLower) || invoice.invoice_date.includes(searchLower);
    });

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Invoices</h1>
                    <p style={{ color: 'var(--text-muted)' }}>View and track your service payments.</p>
                </div>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search invoices..."
                        style={{
                            width: '100%',
                            padding: '0.625rem 1rem 0.625rem 2.75rem',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.875rem',
                            outline: 'none'
                        }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <Card noPadding>
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Service / Plan</th>
                                <th>Total Amount</th>
                                <th>Billed Date</th>
                                <th style={{ textAlign: 'right' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4">Loading financial records...</td></tr>
                            ) : filteredInvoices.length > 0 ? filteredInvoices.map((invoice) => (
                                <tr key={invoice.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ padding: '0.5rem', background: '#f0fdfa', borderRadius: '8px', color: 'var(--primary)' }}>
                                                <FileText size={16} />
                                            </div>
                                            <span style={{ fontWeight: 600 }}>{invoice.booking?.service?.service_name || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                                            Rs. {parseFloat(invoice.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                            <Calendar size={14} />
                                            {invoice.invoice_date}
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <Badge status={invoice.payment_status}>{invoice.payment_status}</Badge>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>No invoices matching your search.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default MyInvoices;


