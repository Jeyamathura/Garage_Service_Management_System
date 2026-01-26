import React, { useState } from 'react';
import styles from './BookingDetails.module.css';
import Badge from '../ui/Badge';
import { updateBooking } from '../../api/booking.api';
import toast from 'react-hot-toast';
import { User, Car, Calendar, Settings } from 'lucide-react';
import Button from '../ui/Button';

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
            toast.error("Failed to update schedule");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.overview}>
                <div className={styles.mainInfo}>
                    <div className={styles.bookingId}>BOOKING BOOK-{booking.id.toString().padStart(4, '0')}</div>
                    <Badge status={booking.status}>{booking.status}</Badge>
                </div>
                <div className={styles.createdDate}>
                    Requested on {formatDate(booking.booking_date || booking.created_at)}
                </div>
            </div>

            <div className={styles.grid}>
                <section className={styles.section}>
                    <h3><User size={16} /> Customer Details</h3>
                    <div className={styles.detailsList}>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Name</span>
                            <span className={styles.value}>{booking.customer?.user?.first_name} {booking.customer?.user?.last_name}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Contact</span>
                            <span className={styles.value}>{booking.customer?.phone || booking.customer?.user?.email}</span>
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <h3><Car size={16} /> Vehicle Info</h3>
                    <div className={styles.detailsList}>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Registration</span>
                            <span className={styles.value}>{booking.vehicle?.vehicle_number}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Model/Type</span>
                            <span className={styles.value}>{booking.vehicle?.model || booking.vehicle?.vehicle_type}</span>
                        </div>
                    </div>
                </section>
            </div>

            <section className={styles.serviceSection}>
                <h3><Settings size={16} /> Service Package</h3>
                <div className={styles.serviceCard}>
                    <div className={styles.serviceMain}>
                        <div className={styles.serviceName}>{booking.service?.service_name}</div>
                        <div className={styles.servicePrice}>Rs. {parseFloat(booking.service?.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    </div>
                    <p className={styles.serviceDesc}>{booking.service?.description}</p>
                </div>
            </section>

            <section className={styles.scheduleSection}>
                <h3><Calendar size={16} /> Workshop Scheduling</h3>
                <div className={styles.scheduleMeta}>
                    <div className={styles.scheduleInfo}>
                        <div className={styles.infoLabel}>Customer Preferred</div>
                        <div className={styles.infoValue}>{formatDate(booking.preferred_date)}</div>
                    </div>
                    <div className={styles.scheduleInfo}>
                        <div className={styles.infoLabel}>Scheduled Workshop Date</div>
                        <div className={`${styles.infoValue} ${booking.scheduled_date ? styles.hasDate : ''}`}>
                            {booking.scheduled_date ? formatDate(booking.scheduled_date) : "Pending Review"}
                        </div>
                    </div>
                </div>

                {["PENDING", "APPROVED", "IN_PROGRESS"].includes(booking.status) && (
                    <div className={styles.management}>
                        {!isEditing ? (
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setIsEditing(true)}
                                icon={Calendar}
                            >
                                Modify Schedule
                            </Button>
                        ) : (
                            <div className={styles.editForm}>
                                <input
                                    type="date"
                                    value={scheduledDate}
                                    onChange={(e) => setScheduledDate(e.target.value)}
                                    className={styles.dateInput}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                                <div className={styles.editActions}>
                                    <Button size="sm" onClick={handleUpdateSchedule} loading={isLoading}>Save</Button>
                                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default BookingDetails;

