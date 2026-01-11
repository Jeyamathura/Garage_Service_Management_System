import api from "./axios";

export const getInvoices = async () => {
    const response = await api.get("/invoices/");
    return response.data;
};

export const createInvoice = async (booking_id, additional_charge = 0) => {
    const response = await api.post("/invoices/", { booking_id, additional_charge });
    return response.data;
};

export const updateInvoiceStatus = async (id, payment_status) => {
    const response = await api.patch(`/invoices/${id}/`, { payment_status });
    return response.data;
};

export const downloadInvoicePDF = async (id) => {
    const response = await api.get(`/invoices/${id}/download_pdf/`, {
        responseType: 'blob'
    });

    // Create a blob URL and trigger download
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice_${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};
