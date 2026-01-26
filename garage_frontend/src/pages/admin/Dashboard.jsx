import React, { useEffect, useState } from "react";
import { getBookings } from "../../api/booking.api";
import { getServices } from "../../api/service.api";
import { getCustomers } from "../../api/customer.api";
import styles from "../Dashboard.module.css";

const Dashboard = () => {
    const [stats, setStats] = useState({
        pending: 0,
        approved: 0,
        inProgress: 0,
        completed: 0,
        totalBookings: 0,
        totalServices: 0,
        totalCustomers: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Use Promise.allSettled to ensure failure in one doesn't stop others
                const results = await Promise.allSettled([
                    getBookings(),
                    getServices(),
                    getCustomers(),
                ]);

                const bookings = results[0].status === 'fulfilled' ? results[0].value : [];
                const services = results[1].status === 'fulfilled' ? results[1].value : [];
                const customers = results[2].status === 'fulfilled' ? results[2].value : [];

                if (results[0].status === 'rejected') console.error("Bookings load failed:", results[0].reason);
                if (results[1].status === 'rejected') console.error("Services load failed:", results[1].reason);
                if (results[2].status === 'rejected') console.error("Customers load failed:", results[2].reason);

                const pending = bookings.filter((b) => b.status === "PENDING").length;
                const approved = bookings.filter((b) => b.status === "APPROVED").length;
                const inProgress = bookings.filter((b) => b.status === "IN_PROGRESS").length;
                const completed = bookings.filter((b) => b.status === "COMPLETED").length;

                setStats({
                    pending,
                    approved,
                    inProgress,
                    completed,
                    totalBookings: bookings.length,
                    totalServices: services.length,
                    totalCustomers: customers.length,
                });
            } catch (error) {
                console.error("Critical dashboard load failure:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const StatCard = ({ title, value, colorClass, subtitle }) => (
        <div className={`${styles.card} ${styles[colorClass]} ${styles.cardHover} group cursor-default transition-all duration-300`}>
            <h3 className={`${styles.cardTitle} group-hover:text-teal-600 transition-colors`}>{title}</h3>
            <div className="flex items-end justify-between">
                <p className={styles.cardValue}>{value}</p>
                {subtitle && <span className="text-xs text-gray-400 font-medium pb-2">{subtitle}</span>}
            </div>
            <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full opacity-60 rounded-full ${colorClass === 'borderYellow' ? 'bg-amber-400' :
                    colorClass === 'borderBlue' ? 'bg-blue-400' :
                        colorClass === 'borderIndigo' ? 'bg-indigo-400' :
                            colorClass === 'borderGreen' ? 'bg-emerald-400' : 'bg-gray-400'
                    }`} style={{ width: value > 0 ? '70%' : '0%' }}></div>
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-60 backdrop-blur-[2px]">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
                        <p className="text-teal-800 font-medium animate-pulse">Loading dashboard stats...</p>
                    </div>
                </div>
            )}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-teal-800 bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                    Admin Dashboard
                </h1>
                <p className="text-gray-500 mt-1">Overview of garage operations and performance</p>
            </div>

            <div className={styles.statsGrid}>
                <StatCard
                    title="Pending Bookings"
                    value={stats.pending}
                    colorClass="borderYellow"
                    subtitle="Awaiting Approval"
                />
                <StatCard
                    title="To Start"
                    value={stats.approved}
                    colorClass="borderBlue"
                    subtitle="Approved"
                />
                <StatCard
                    title="In Progress"
                    value={stats.inProgress}
                    colorClass="borderIndigo"
                    subtitle="Working Now"
                />
                <StatCard
                    title="Completed"
                    value={stats.completed}
                    colorClass="borderGreen"
                    subtitle="Ready for Pickup"
                />
            </div>

            <div className="mt-12 mb-6">
                <h2 className="text-xl font-semibold text-teal-800 flex items-center gap-2">
                    <span className="w-2 h-8 bg-teal-500 rounded-full"></span>
                    Management Overview
                </h2>
            </div>

            <div className={`${styles.statsGrid} ${styles.statsGridThree}`}>
                <StatCard
                    title="Total Customers"
                    value={stats.totalCustomers}
                    colorClass="borderGray"
                />
                <StatCard
                    title="Total Services"
                    value={stats.totalServices}
                    colorClass="borderGray"
                />
                <StatCard
                    title="Total Bookings"
                    value={stats.totalBookings}
                    colorClass="borderGray"
                />
            </div>
        </div>
    );
};

export default Dashboard;
