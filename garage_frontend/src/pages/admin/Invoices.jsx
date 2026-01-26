import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getInvoices, updateInvoiceStatus, updateInvoiceCharges, downloadInvoicePDF } from '../../api/invoice.api';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import InvoiceCard from '../../components/invoice/InvoiceCard';
import {
    FileText,
    Download,
    Pencil,
    Check,
    X,
    Search,
    Filter,
    User,
    Calendar
} from 'lucide-react';

import styles from './Invoices.module.css';

const Invoices = () => {
    const location = useLocation();
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [highlightedId, setHighlightedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [editValues, setEditValues] = useState({});

    useEffect(() => {
        fetchInvoices();
    }, []);

    useEffect(() => {
        if (location.state?.invoiceId && invoices.length > 0) {
            const targetId = location.state.invoiceId;
            const targetInvoice = invoices.find(inv => inv.id === targetId);

            if (targetInvoice) {
                setSearchQuery(`INV-${targetId.toString().padStart(4, '0')}`);
                setHighlightedId(targetId);
                setSelectedInvoice(targetInvoice);

                // Delay modal slightly so user sees the "blink" in the list first
                setTimeout(() => setShowModal(true), 500);

                // Clear state to prevent reopening if we needed to, but for now this is fine
                window.history.replaceState({}, document.title);

                // Clear highlight after animation ends (matches CSS duration)
                setTimeout(() => setHighlightedId(null), 2500);
            }
        }
    }, [invoices, location.state]);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const data = await getInvoices();
            setInvoices(data);
        } catch (error) {
            toast.error("Failed to load invoices");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateInvoiceStatus(id, newStatus);
            fetchInvoices();
            toast.success("Invoice status updated");
        } catch (error) {
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
            toast.success("Charges updated successfully");
        } catch (error) {
            toast.error("Failed to update charges");
        }
    };

    const handleCancelEdit = (e) => {
        e.stopPropagation();
        setEditingId(null);
        setEditValues({});
    };

    const filteredInvoices = invoices.filter(invoice => {
        const searchLower = searchQuery.toLowerCase();
        const customerUsername = invoice.booking?.customer?.user?.username?.toLowerCase() || "";
        const invoiceId = `INV-${invoice.id.toString().padStart(4, '0')}`.toLowerCase();
        const statusMatch = statusFilter === "ALL" || invoice.payment_status === statusFilter;

        return statusMatch && (customerUsername.includes(searchLower) || invoiceId.includes(searchLower));
    });

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Financial Records</h1>
                    <p className={styles.subtitle}>Manage customer billing and payment statuses.</p>
                </div>
                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Total Revenue</span>
                        <span className={styles.statValue}>Rs. {invoices.reduce((acc, inv) => acc + parseFloat(inv.total_amount || 0), 0).toLocaleString()}</span>
                    </div>
                </div>
            </header>

            <Card className={styles.tableCard} noPadding>
                <div className={styles.tableActions}>
                    <div className={styles.searchWrapper}>
                        <Search size={18} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search by Invoice ID or Customer..."
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className={styles.filterWrapper}>
                        <Filter size={18} className={styles.filterIcon} />
                        <select
                            className={styles.statusFilter}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">All Payments</option>
                            <option value="PENDING">Pending</option>
                            <option value="PAID">Paid</option>
                        </select>
                    </div>
                </div>

                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer</th>
                                <th>Billing Details</th>
                                <th>Extra Charges</th>
                                <th>Total Charges</th>
                                <th>Date</th>
                                <th>Payment Status</th>
                                <th>Management</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i}><td colSpan="8"><div className={styles.skeletonLine}></div></td></tr>
                                ))
                            ) : filteredInvoices.length > 0 ? filteredInvoices.map((invoice) => (
                                <tr
                                    key={invoice.id}
                                    onClick={() => handleRowClick(invoice)}
                                    className={`${styles.clickableRow} ${highlightedId === invoice.id ? styles.highlightedRow : ''}`}
                                >
                                    <td>
                                        <div className={styles.invoiceId}>INV-{invoice.id.toString().padStart(4, '0')}</div>
                                    </td>
                                    <td>
                                        <div className={styles.customerName}>
                                            <User size={12} />
                                            {invoice.booking?.customer?.user?.username || 'N/A'}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.servicePrice}>
                                            Rs. {parseFloat(invoice.booking?.service?.price || 0).toLocaleString()}
                                        </div>
                                        <div className={styles.serviceName}>
                                            {invoice.booking?.service?.service_name || "Custom Service"}
                                        </div>
                                    </td>

                                    <td onClick={(e) => e.stopPropagation()}>
                                        {editingId === invoice.id ? (
                                            <div className={styles.editGrid}>
                                                <input
                                                    type="number"
                                                    value={editValues.charges}
                                                    onChange={(e) => setEditValues({
                                                        ...editValues,
                                                        charges: parseFloat(e.target.value) || 0
                                                    })}
                                                    className={styles.editInput}
                                                />
                                                <input
                                                    type="text"
                                                    value={editValues.description}
                                                    onChange={(e) => setEditValues({
                                                        ...editValues,
                                                        description: e.target.value
                                                    })}
                                                    className={styles.editInput}
                                                    placeholder="Description"
                                                />
                                                <div className={styles.editActions}>
                                                    <button onClick={(e) => handleSaveCharges(invoice.id, e)} className={styles.saveBtn}><Check size={14} color="green" /></button>
                                                    <button onClick={handleCancelEdit} className={styles.cancelBtn}><X size={14} color="red" /></button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className={styles.chargeInfo}>
                                                    <span className={invoice.additional_charges > 0 ? styles.positivePrice : styles.mutedText}>
                                                        Rs. {parseFloat(invoice.additional_charges || 0).toLocaleString()}
                                                    </span>
                                                    <button
                                                        onClick={(e) => handleEditClick(invoice, e)}
                                                        className={styles.inlineEditBtn}
                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                </div>
                                                {invoice.additional_charges_description && (
                                                    <div className={styles.chargeDescription}>
                                                        {invoice.additional_charges_description}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </td>

                                    <td className={styles.totalValue}>Rs. {parseFloat(invoice.total_amount).toLocaleString()}</td>
                                    <td>
                                        <div className={styles.dateText}>{invoice.invoice_date}</div>
                                    </td>
                                    <td>
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <select
                                                value={invoice.payment_status || 'PENDING'}
                                                onChange={(e) => handleStatusChange(invoice.id, e.target.value)}
                                                className={`${styles.statusSelect} ${styles[invoice.payment_status?.toLowerCase()]}`}
                                            >
                                                <option value="PENDING">PENDING</option>
                                                <option value="PAID">PAID</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <Button variant="ghost" size="sm" icon={Download}></Button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="8" className={styles.emptyState}>No financial records found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Official Invoice Voucher"
                size="lg"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                        <Button icon={Download} onClick={handleDownloadPDF}>Download PDF</Button>
                    </>
                }
            >
                {selectedInvoice && <InvoiceCard invoice={selectedInvoice} />}
            </Modal>
        </div>
    );
};

export default Invoices;

