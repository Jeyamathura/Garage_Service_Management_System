import React from "react";
import styles from "./InvoiceCard.module.css";

const InvoiceCard = ({ invoice }) => {
    if (!invoice) return null;

    // Debug logging
    console.log('Invoice data:', invoice);
    console.log('Service price:', invoice.booking?.service?.price);

    const servicePrice = invoice.booking?.service?.price ? parseFloat(invoice.booking.service.price) : 0;
    const totalAmount = invoice.total_amount ? parseFloat(invoice.total_amount) : 0;
    const additionalCharges = (totalAmount - servicePrice).toFixed(2);

    return (
        <div className={styles.invoiceCard}>
            {/* Header */}
            <div className={styles.invoiceHeader}>
                <div>
                    <h2>GARAGE NAME</h2>
                    <p className={styles.invoiceSubTitle}>Vehicle Service Invoice</p>
                </div>
                <div className={styles.invoiceMeta}>
                    <p><strong>Invoice :</strong> {invoice.id}</p>
                    <p><strong>Date:</strong> {invoice.invoice_date}</p>
                    <p><strong>Booking ID:</strong> {invoice.booking?.id}</p>
                </div>
            </div>

            {/* Customer & Vehicle */}
            <div className={styles.invoiceGrid}>
                <div>
                    <h4>Bill To</h4>
                    <p>{invoice.booking?.customer?.user?.username}</p>
                    <p>{invoice.booking?.customer?.phone}</p>
                </div>
                <div>
                    <h4>Vehicle Details</h4>
                    <p>{invoice.booking?.vehicle?.vehicle_type}</p>
                    <p>{invoice.booking?.vehicle?.vehicle_number}</p>
                </div>
            </div>

            {/* Service Table */}
            <table className={styles.invoiceTable}>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th align="right">Amount (Rs.)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <strong>{invoice.booking?.service?.service_name}</strong>
                            <div className={styles.muted}>
                                {invoice.booking?.service?.description}
                            </div>
                        </td>
                        <td align="right"></td>
                    </tr>
                    <tr>
                        <td>Charge for the Service</td>
                        <td align="right">{servicePrice.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Additional Charges</td>
                        <td align="right">{additionalCharges}</td>
                    </tr>
                </tbody>
            </table>

            {/* Totals */}
            <div className={styles.invoiceTotals}>
                <p>Total Amount</p>
                <p>Rs. {totalAmount.toFixed(2)}</p>
            </div>

            {/* Payment */}
            <div className={styles.invoicePayment}>
                <p>
                    <strong>Status:</strong>{" "}
                    <span
                        className={
                            invoice.payment_status === "PAID"
                                ? styles.paid
                                : styles.pending
                        }
                    >
                        {invoice.payment_status}
                    </span>
                </p>
                <p><strong>Payment Method:</strong> Cash / Card</p>
            </div>

            {/* Footer */}
            <div className={styles.invoiceFooter}>
                <p>Authorized Signature</p>
                <p>Thank you for choosing our service.</p>
            </div>
        </div>
    );
};

export default InvoiceCard;