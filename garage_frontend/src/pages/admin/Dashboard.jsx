import React, { useEffect, useState } from 'react';
import { getBookings } from '../../api/booking.api';
import { getServices } from '../../api/service.api';
import { getCustomers } from '../../api/customer.api';
import styles from '../Dashboard.module.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        pending: 0,
        approved: 0,
        inProgress: 0,
        completed: 0,
        totalBookings: 0,
        totalServices: 0,
        totalCustomers: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookings, services, customers] = await Promise.all([
                    getBookings(),
                    getServices(),
                    getCustomers()
                ]);

                const pending = bookings.filter(b => b.status === 'PENDING').length;
                const approved = bookings.filter(b => b.status === 'APPROVED').length;
                const inProgress = bookings.filter(b => b.status === 'IN_PROGRESS').length;
                const completed = bookings.filter(b => b.status === 'COMPLETED').length;

                setStats({
                    pending,
                    approved,
                    inProgress,
                    completed,
                    totalBookings: bookings.length,
                    totalServices: services.length,
                    totalCustomers: customers.length
                });

            } catch (error) {
                console.error("Failed to load dashboard data", error);
            }
        };

        fetchData();
    }, []);

    const StatCard = ({ title, value, colorClass }) => (
        <div className={`${styles.card} ${styles[colorClass]}`}>
            <h3 className={styles.cardTitle}>{title}</h3>
            <p className={styles.cardValue}>{value}</p>
        </div>
    );

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Admin Dashboard</h1>

            <div className={styles.statsGrid}>
                <StatCard title="Pending Bookings" value={stats.pending} colorClass="borderYellow" />
                <StatCard title="To Start (Approved)" value={stats.approved} colorClass="borderBlue" />
                <StatCard title="In Progress" value={stats.inProgress} colorClass="borderIndigo" />
                <StatCard title="Completed" value={stats.completed} colorClass="borderGreen" />
            </div>

            <div className={`${styles.statsGrid} ${styles.statsGridThree}`}>
                <StatCard title="Total Customers" value={stats.totalCustomers} colorClass="borderGray" />
                <StatCard title="Total Services" value={stats.totalServices} colorClass="borderGray" />
                <StatCard title="Total Bookings" value={stats.totalBookings} colorClass="borderGray" />
            </div>
        </div>
    );
};

export default Dashboard;
