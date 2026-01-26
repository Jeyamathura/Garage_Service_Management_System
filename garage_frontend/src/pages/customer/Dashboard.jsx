import React, { useEffect, useState, useCallback } from "react";
import { getBookings } from "../../api/booking.api";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import styles from "../Dashboard.module.css";

const Dashboard = () => {
    const { user } = useAuth();
    const [upcoming, setUpcoming] = useState(null);

    const fetchBookings = useCallback(async () => {
        try {
            const bookings = await getBookings();
            // Find next upcoming (Approved or In Progress) by earliest scheduled date
            const next = bookings
                .filter(
                    (b) =>
                        ["APPROVED", "IN_PROGRESS"].includes(b.status) && b.scheduled_date
                )
                .sort((a, b) => {
                    const dateA = new Date(a.scheduled_date);
                    const dateB = new Date(b.scheduled_date);
                    return dateA - dateB;
                })[0];
            setUpcoming(next);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                Welcome,{" "}
                <span className={styles.username}>
                    <div className="border-b border-gray-200">
                        {user?.username}
                    </div>
                </span>
            </h1>
            {upcoming ? (
                <div className={styles.cardBlue}>
                    <h2
                        className={styles.cardTitle}
                        style={{
                            color: "#1e3a8a",
                            fontSize: "1.25rem",
                            marginBottom: "1rem",
                        }}
                    >
                        Upcoming Service
                    </h2>
                    <p style={{ marginBottom: "0.5rem" }}>
                        <strong>Vehicle:</strong> {upcoming.vehicle.vehicle_number}
                    </p>
                    <p style={{ marginBottom: "0.5rem" }}>
                        <strong>Service:</strong> {upcoming.service.service_name}
                    </p>
                    <p style={{ marginBottom: "0.5rem" }}>
                        <strong>Date:</strong> {upcoming.scheduled_date}
                    </p>
                    <div style={{ marginTop: "1rem" }}>
                        <span className={`badge badge-${upcoming.status.toLowerCase()}`}>
                            {upcoming.status}
                        </span>
                    </div>
                </div>
            ) : (
                <div className={styles.cardGray}>
                    <p className={styles.cardTitle} style={{ textTransform: "none" }}>
                        No upcoming services scheduled.
                    </p>
                </div>
            )}

            <div className={styles.statsGrid}>
                <Link to="/customer/bookings" style={{ textDecoration: "none" }}>
                    <div className={`${styles.card} ${styles.cardHover}`}>
                        <h3
                            className={styles.cardTitle}
                            style={{ fontSize: "1.1rem", color: "#0f172a" }}
                        >
                            My Bookings
                        </h3>
                        <p style={{ color: "#64748b" }}>
                            Request service and view history.
                        </p>
                    </div>
                </Link>
                <Link to="/customer/vehicles" style={{ textDecoration: "none" }}>
                    <div className={`${styles.card} ${styles.cardHover}`}>
                        <h3
                            className={styles.cardTitle}
                            style={{ fontSize: "1.1rem", color: "#0f172a" }}
                        >
                            My Vehicles
                        </h3>
                        <p style={{ color: "#64748b" }}>Manage your vehicles.</p>
                    </div>
                </Link>
                <Link to="/customer/invoices" style={{ textDecoration: "none" }}>
                    <div className={`${styles.card} ${styles.cardHover}`}>
                        <h3
                            className={styles.cardTitle}
                            style={{ fontSize: "1.1rem", color: "#0f172a" }}
                        >
                            My Invoices
                        </h3>
                        <p style={{ color: "#64748b" }}>View payment history.</p>
                    </div>
                </Link>
                <Link to="/customer/profile" style={{ textDecoration: "none" }}>
                    <div className={`${styles.card} ${styles.cardHover}`}>
                        <h3
                            className={styles.cardTitle}
                            style={{ fontSize: "1.1rem", color: "#0f172a" }}
                        >
                            My Profile
                        </h3>
                        <p style={{ color: "#64748b" }}>Update your contact details.</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
