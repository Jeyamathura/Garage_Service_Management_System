import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getInvoices, updateInvoiceStatus, updateInvoiceCharges, downloadInvoicePDF } from '../../api/invoice.api';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import InvoiceCard from '../../components/invoice/InvoiceCard';

const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editValues, setEditValues] = useState({});

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const data = await getInvoices();
            setInvoices(data);
        } catch (error) {
            console.error("Failed to fetch invoices", error);
            toast.error("Failed to load invoices");
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateInvoiceStatus(id, newStatus);
            fetchInvoices();
            toast.success("Invoice status updated");
        } catch (error) {
            console.error("Failed to update invoice status", error);
            toast.error("Failed to update status");
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
                toast.success("Download started");
            } catch (error) {
                console.error("Failed to download PDF", error);
                toast.error("Failed to download PDF");
            }
        }
    };

    const handleEditClick = (invoice, e) => {
        e.stopPropagation();
        setEditingId(invoice.id);
        setEditValues({
            charges: parseFloat(invoice.additional_charges || 0),
            description: invoice.additional_charges_description || ''
        });
    };

    const handleSaveCharges = async (invoiceId, e) => {
        e.stopPropagation();
        try {
            await updateInvoiceCharges(
                invoiceId,
                editValues.charges,
                editValues.description
            );
            setEditingId(null);
            setEditValues({});
            fetchInvoices();
            toast.success("Additional charges updated successfully");
        } catch (error) {
            console.error("Failed to update charges", error);
            toast.error("Failed to update charges");
        }
    };

    const handleCancelEdit = (e) => {
        e.stopPropagation();
        setEditingId(null);
        setEditValues({});
    };

    return (
        <div className="p-4">
            <h1 className="mb-4">Manage Invoices</h1>
            <Table headers={['Invoice ID', 'Booking ID', 'Customer', 'Service Price', 'Additional Charges', 'Total Amount', 'Date', 'Status']}>
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
                        <td>
                            <div>
                                Rs. {parseFloat(invoice.booking?.service?.price || 0).toFixed(2)}
                                {invoice.booking?.service?.service_name && (
                                    <div style={{ fontSize: '0.85em', color: '#666' }}>
                                        {invoice.booking.service.service_name}
                                    </div>
                                )}
                            </div>
                        </td>

                        {/* Additional Charges Column with Inline Edit */}
                        <td onClick={(e) => e.stopPropagation()}>
                            {editingId === invoice.id ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={editValues.charges}
                                            onChange={(e) => setEditValues({
                                                ...editValues,
                                                charges: parseFloat(e.target.value) || 0
                                            })}
                                            className="border rounded px-2 py-1"
                                            style={{ width: '100px' }}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={editValues.description}
                                        onChange={(e) => setEditValues({
                                            ...editValues,
                                            description: e.target.value
                                        })}
                                        className="border rounded px-2 py-1"
                                        placeholder="Description"
                                        style={{ fontSize: '0.85em' }}
                                    />
                                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                                        <button
                                            onClick={(e) => handleSaveCharges(invoice.id, e)}
                                            className="border rounded px-2 py-1 bg-green-500 text-white"
                                            style={{ fontSize: '0.8em' }}
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="border rounded px-2 py-1 bg-gray-300"
                                            style={{ fontSize: '0.8em' }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div>
                                        {invoice.additional_charges > 0 ? (
                                            <>
                                                Rs. {parseFloat(invoice.additional_charges).toFixed(2)}
                                                {invoice.additional_charges_description && (
                                                    <div style={{ fontSize: '0.85em', color: '#666' }}>
                                                        {invoice.additional_charges_description}
                                                    </div>
                                                )}
                                            </>
                                        ) : '-'}
                                    </div>
                                    <button
                                        onClick={(e) => handleEditClick(invoice, e)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '2px',
                                            color: '#666'
                                        }}
                                        title="Edit charges"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </td>

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
