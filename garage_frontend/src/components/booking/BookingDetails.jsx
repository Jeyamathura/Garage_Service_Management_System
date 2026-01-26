import React, { useState } from 'react';
import styles from './BookingDetails.module.css';
import StatusBadge from '../ui/StatusBadge';
import { updateBooking } from '../../api/booking.api';
import toast from 'react-hot-toast';

const BookingDetails = ({ booking, onUpdate }) => {
    const [scheduledDate, setScheduledDate] = useState(booking?.scheduled_date || "");
    const [isEditing, setIsEditing] = useState(!booking?.scheduled_date);
    const [isLoading, setIsLoading] = useState(false);

    if (!booking) return null;

    const formatDate = (dateString) => {
        if (!dateString) return "Not set";
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleUpdateSchedule = async () => {
        if (!scheduledDate) {
            toast.error("Please select a date");
            return;
        }

        setIsLoading(true);
        try {
            await updateBooking(booking.id, { scheduled_date: scheduledDate });
            toast.success("Schedule updated successfully");
            setIsEditing(false);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Failed to update schedule", error);
            toast.error("Failed to update schedule");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setScheduledDate(booking?.scheduled_date || "");
        setIsEditing(false);
    };

    return (
        <div className={styles.bookingDetails}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div>
                        <h2>BOOKING #{booking.id}</h2>
                        <div className={styles.status}>
                            <StatusBadge status={booking.status} />
                        </div>
                    </div>
                    <div className={styles.meta}>
                        <p><strong>Created:</strong> {formatDate(booking.booking_date || booking.created_at)}</p>
                    </div>
                </div>

                <div className={styles.grid}>
                    <div className={styles.section}>
                        <h4>Customer Information</h4>
                        <div className={styles.info}>
                            <p><strong>Name</strong> {booking.customer?.user?.first_name} {booking.customer?.user?.last_name}</p>
                            <p><strong>Phone</strong> {booking.customer?.phone || 'N/A'}</p>
                            <p><strong>Email</strong> {booking.customer?.user?.email}</p>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h4>Vehicle Details</h4>
                        <div className={styles.info}>
                            <p><strong>Type</strong> {booking.vehicle?.vehicle_type}</p>
                            <p><strong>Number</strong> {booking.vehicle?.vehicle_number}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <h4>Service Requested</h4>
                    <div className={styles.serviceCard}>
                        <div className={styles.serviceHeader}>
                            <h3>{booking.service?.service_name}</h3>
                            <div className={styles.price}>Rs. {parseFloat(booking.service?.price || 0).toFixed(2)}</div>
                        </div>
                        <p className={styles.description}>{booking.service?.description}</p>
                    </div>
                </div>

                {/* Schedule Management Section */}
                <div className={styles.scheduleSection}>
                    <h4>Schedule Management</h4>
                    <div className={styles.historyInfo}>
                        <div className={styles.historyItem}>
                            <span className={styles.historyLabel}>Preferred Date</span>
                            <span className={styles.historyValue}>{formatDate(booking.preferred_date)}</span>
                        </div>
                        <div className={styles.historyItem}>
                            <span className={styles.historyLabel}>Current Schedule</span>
                            <span className={styles.historyValue}>{formatDate(booking.scheduled_date)}</span>
                        </div>
                    </div>

                    {["PENDING", "APPROVED", "IN_PROGRESS"].includes(booking.status) && (
                        <>
                            {!isEditing ? (
                                <button
                                    className={styles.editBtn}
                                    onClick={() => setIsEditing(true)}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                    Change Scheduled Date
                                </button>
                            ) : (
                                <div className={styles.updateForm}>
                                    <div className={styles.inputGroup}>
                                        <label>New Scheduled Date</label>
                                        <input
                                            type="date"
                                            value={scheduledDate}
                                            onChange={(e) => setScheduledDate(e.target.value)}
                                            className={styles.dateInput}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <button
                                            onClick={handleUpdateSchedule}
                                            disabled={isLoading}
                                            className={styles.updateBtn}
                                        >
                                            {isLoading ? "Updating..." : "Save Schedule"}
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className={styles.cancelBtn}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;
