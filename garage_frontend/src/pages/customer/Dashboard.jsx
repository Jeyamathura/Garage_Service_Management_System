import React, { useEffect, useState, useCallback } from "react";
import { getBookings } from "../../api/booking.api";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import {
    Calendar,
    Car,
    FileText,
    User,
    Clock,
    CheckCircle2,
    ChevronRight,
    PlusCircle
} from "lucide-react";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
    const { user } = useAuth();
    const [upcoming, setUpcoming] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            const bookings = await getBookings();
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
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const stats = [
        { label: "Bookings", icon: Calendar, path: "/customer/bookings", color: "blue", description: "View and manage your service appointments" },
        { label: "Vehicles", icon: Car, path: "/customer/vehicles", color: "teal", description: "Add or manage your registered vehicles" },
        { label: "Invoices", icon: FileText, path: "/customer/invoices", color: "purple", description: "Access and pay your service invoices" },
        { label: "Profile", icon: User, path: "/customer/profile", color: "indigo", description: "Manage your account and preferences" },
    ];

    return (
        <div className={styles.dashboardContainer}>
            <header className={styles.header}>
                <div className={styles.welcomeSection}>
                    <h1 className={styles.welcomeTitle}>
                        Hello <span className={styles.gradientText}>{user?.first_name || user?.username},</span>
                    </h1>
                    <p className={styles.welcomeSubtitle}>Track your vehicle maintenance and upcoming services.</p>
                </div>
                <Link to="/customer/bookings">
                    <Button icon={PlusCircle}>New Booking</Button>
                </Link>
            </header>

            <div className={styles.mainGrid}>
                {/* Upcoming Service Section */}
                <div className={styles.prioritySection}>
                    <h2 className={styles.sectionTitle}>
                        <Clock size={20} className={styles.icon} />
                        Next Service
                    </h2>
                    {loading ? (
                        <div className={styles.skeletonCard}></div>
                    ) : upcoming ? (
                        <Card className={styles.upcomingCard} noPadding>
                            <div className={styles.upcomingHeader}>
                                <div className={styles.serviceInfo}>
                                    <div className={styles.iconBox}>
                                        <Car size={24} color="var(--primary)" />
                                    </div>
                                    <div>
                                        <h3>{upcoming.service.service_name}</h3>
                                        <p>{upcoming.vehicle.vehicle_number} • {upcoming.vehicle.model}</p>
                                    </div>
                                </div>
                                <Badge status={upcoming.status}>{upcoming.status}</Badge>
                            </div>
                            <div className={styles.upcomingDetails}>
                                <div className={styles.detailItem}>
                                    <Calendar size={16} />
                                    <span>{new Date(upcoming.scheduled_date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <Clock size={16} />
                                    <span>{new Date(upcoming.scheduled_date).toLocaleTimeString(undefined, { timeStyle: 'short' })}</span>
                                </div>
                            </div>
                            <div className={styles.upcomingFooter}>
                                <Link to="/customer/bookings">
                                    <Button variant="ghost" size="sm" icon={ChevronRight}>View Details</Button>
                                </Link>
                            </div>
                        </Card>
                    ) : (
                        <Card className={styles.emptyStateCard}>
                            <div className={styles.emptyIcon}>
                                <CheckCircle2 size={40} color="var(--success)" />
                            </div>
                            <h3>All Caught Up!</h3>
                            <p>No upcoming services scheduled for your vehicles.</p>
                            <Link to="/customer/bookings">
                                <Button variant="outline" size="sm">Schedule Now</Button>
                            </Link>
                        </Card>
                    )}
                </div>

                {/* Quick Actions Grid */}
                <div className={styles.actionsGrid}>
                    <h2 className={styles.sectionTitle}>Quick Actions</h2>
                    <div className={styles.statsGrid}>
                        {stats.map((stat) => (
                            <Link key={stat.label} to={stat.path} className={styles.statLink}>
                                <Card className={styles.statCard}>
                                    <div className={`${styles.statIcon} ${styles[stat.color]}`}>
                                        <stat.icon size={24} />
                                    </div>
                                    <h3>{stat.label}</h3>
                                    <p>{stat.description}</p>
                                    <div className={styles.cardArrow}>
                                        <ChevronRight size={16} />
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

