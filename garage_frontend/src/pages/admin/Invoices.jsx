import React, { useEffect, useState } from 'react';
import { getInvoices, updateInvoiceStatus, downloadInvoicePDF } from '../../api/invoice.api';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import InvoiceCard from '../../components/invoice/InvoiceCard';

const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showModal, setShowModal] = useState(false);

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

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateInvoiceStatus(id, newStatus);
            fetchInvoices();
        } catch (error) {
            console.error("Failed to update invoice status", error);
        }
    };

    const handleRowClick = (invoice) => {
        setSelectedInvoice(invoice);
        setShowModal(true);
    };

    const handleDownloadPDF = async () => {
        if (selectedInvoice) {
            try {
                await downloadInvoicePDF(selectedInvoice.id);
            } catch (error) {
                console.error("Failed to download PDF", error);
            }
        }
    };

    return (
        <div className="p-4">
            <h1 className="mb-4">Manage Invoices</h1>
            <Table headers={['Invoice ID', 'Booking ID', 'Customer', 'Amount', 'Date', 'Status']}>
                {invoices.map((invoice) => (
                    <tr
                        key={invoice.id}
                        onClick={() => handleRowClick(invoice)}
                        style={{ cursor: 'pointer' }}
                        className="hover:bg-gray-100"
                    >
                        <td>{invoice.id}</td>
                        <td>{invoice.booking?.id || 'N/A'}</td>
                        <td>{invoice.booking?.customer?.user?.username || 'N/A'}</td>
                        <td>Rs. {parseFloat(invoice.total_amount).toFixed(2)}</td>
                        <td>{invoice.invoice_date}</td>
                        <td onClick={(e) => e.stopPropagation()}>
                            <select
                                value={invoice.payment_status || 'PENDING'}
                                onChange={(e) => handleStatusChange(invoice.id, e.target.value)}
                                className="border rounded px-2 py-1"
                            >
                                <option value="PENDING">PENDING</option>
                                <option value="PAID">PAID</option>
                            </select>
                        </td>
                    </tr>
                ))}
            </Table>

            {showModal && selectedInvoice && (
                <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="INVOICE">
                    <div className="bg-white">
                        <InvoiceCard invoice={selectedInvoice} />

                        {/* Action Buttons */}
                        <div className="flex gap-3 justify-end mt-6">
                            <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                            <Button variant="primary" onClick={handleDownloadPDF}>Download PDF</Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Invoices;
