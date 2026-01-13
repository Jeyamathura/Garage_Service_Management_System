import React, { useEffect, useState } from 'react';
import { getBookings, approveBooking, rejectBooking, startBooking, completeBooking } from '../../api/booking.api';
import { createInvoice } from '../../api/invoice.api';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [scheduledDate, setScheduledDate] = useState('');
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const data = await getBookings();
            setBookings(data);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        }
    };

    const handleApproveClick = (booking) => {
        setSelectedBooking(booking);
        setScheduledDate(booking.preferred_date || ''); // Default to preferred
        setIsApproveModalOpen(true);
    };

    const handleConfirmApprove = async (e) => {
        e.preventDefault();
        try {
            await approveBooking(selectedBooking.id, scheduledDate);
            setIsApproveModalOpen(false);
            fetchBookings();
        } catch (error) {
            alert("Failed to approve booking");
        }
    };

    const handleReject = async (id) => {
        if (window.confirm("Reject this booking?")) {
            await rejectBooking(id);
            fetchBookings();
        }
    };

    const handleStart = async (id) => {
        if (window.confirm("Start service for this booking?")) {
            await startBooking(id);
            fetchBookings();
        }
    };

    const handleComplete = async (id) => {
        if (window.confirm("Mark service as completed?")) {
            await completeBooking(id);
            fetchBookings();
        }
    };

    const handleGenerateInvoice = async (bookingId) => {
        if (window.confirm("Generate invoice for this booking?")) {
            try {
                await createInvoice(bookingId);
                alert("Invoice generated successfully!");
                // Maybe redirect to invoices or refresh
            } catch (error) {
                alert(error.response?.data?.error || "Failed to generate invoice");
            }
        }
    };

    return (
        <div className="p-4">
            <h1 className="mb-4">Manage Bookings</h1>
            <Table headers={['Customer', 'Vehicle', 'Service', 'Date', 'Status', 'Actions']}>
                {bookings.map((booking) => (
                    <tr key={booking.id}>
                        <td>{booking.id}</td>
                        <td>{booking.customer.user.username}</td>
                        <td>{booking.vehicle.vehicle_number}</td>
                        <td>{booking.service.service_name}</td>
                        <td>{booking.scheduled_date || booking.preferred_date || 'N/A'}</td>
                        <td><StatusBadge status={booking.status} /></td>
                        <td>
                            <div className="flex gap-2">
                                {booking.status === 'PENDING' && (
                                    <>
                                        <Button variant="success" size="sm" onClick={() => handleApproveClick(booking)}>Approve</Button>
                                        <Button variant="danger" size="sm" onClick={() => handleReject(booking.id)}>Reject</Button>
                                    </>
                                )}
                                {booking.status === 'APPROVED' && (
                                    <Button variant="primary" size="sm" onClick={() => handleStart(booking.id)}>Start Work</Button>
                                )}
                                {booking.status === 'IN_PROGRESS' && (
                                    <Button variant="success" size="sm" onClick={() => handleComplete(booking.id)}>Complete</Button>
                                )}
                                {booking.status === 'COMPLETED' && (
                                    <Button variant="secondary" size="sm" onClick={() => handleGenerateInvoice(booking.id)}>Generate Invoice</Button>
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
            </Table>

            <Modal
                isOpen={isApproveModalOpen}
                onClose={() => setIsApproveModalOpen(false)}
                title="Approve Booking"
            >
                <form onSubmit={handleConfirmApprove}>
                    <Input
                        label="Scheduled Date"
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        required
                    />
                    <div className="flex justify-end mt-4">
                        <Button type="submit">Confirm Approval</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Bookings;
