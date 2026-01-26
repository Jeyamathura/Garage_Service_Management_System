import React, { useEffect, useState } from "react";
import { getBookings } from "../../api/booking.api";
import { getServices } from "../../api/service.api";
import { getCustomers } from "../../api/customer.api";
import Card from "../../components/ui/Card";
import {
    Users,
    Calendar,
    Settings,
    CheckCircle,
    Clock,
    Activity,
    TrendingUp,
    AlertCircle
} from "lucide-react";
import styles from "./Dashboard.module.css";

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
                const results = await Promise.allSettled([
                    getBookings(),
                    getServices(),
                    getCustomers(),
                ]);

                const bookings = results[0].status === 'fulfilled' ? results[0].value : [];
                const services = results[1].status === 'fulfilled' ? results[1].value : [];
                const customers = results[2].status === 'fulfilled' ? results[2].value : [];

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
                console.error("Dashboard load failure:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const MainStat = ({ title, value, icon: Icon, color, trend }) => (
        <Card className={styles.statCard}>
            <div className={styles.statHeader}>
                <div className={`${styles.iconBox} ${styles[color]}`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <div className={styles.trendBadge}>
                        <TrendingUp size={12} />
                        <span>{trend}</span>
                    </div>
                )}
            </div>
            <div className={styles.statValue}>{value}</div>
            <div className={styles.statTitle}>{title}</div>
        </Card>
    );

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>Operational Overview</h1>
                    <p className={styles.pageSubtitle}>Monitor real-time garage performance and service metrics.</p>
                </div>
                <div className={styles.activeLabel}>
                    <div className={styles.pulse}></div>
                    <span>Live System Active</span>
                </div>
            </header>

            <div className={styles.mainStats}>
                <MainStat
                    title="Requests Pending"
                    value={stats.pending}
                    icon={AlertCircle}
                    color="orange"
                    trend="+2 this hour"
                />
                <MainStat
                    title="Active Services"
                    value={stats.inProgress}
                    icon={Activity}
                    color="blue"
                />
                <MainStat
                    title="Total Customers"
                    value={stats.totalCustomers}
                    icon={Users}
                    color="purple"
                />
                <MainStat
                    title="Success Rate"
                    value={`${Math.round((stats.completed / stats.totalBookings || 0) * 100)}%`}
                    icon={CheckCircle}
                    color="green"
                />
            </div>

            <div className={styles.sectionGrid}>
                <Card title="Booking Pipeline" className={styles.pipelineCard}>
                    <div className={styles.pipelineList}>
                        <div className={styles.pipelineItem}>
                            <div className={styles.pipelineLabel}>
                                <Clock size={16} />
                                <span>Pending Review</span>
                            </div>
                            <div className={styles.pipelineValue}>{stats.pending}</div>
                            <div className={styles.pipelineBar}><div style={{ width: `${(stats.pending / stats.totalBookings) * 100}%`, background: '#f59e0b' }}></div></div>
                        </div>
                        <div className={styles.pipelineItem}>
                            <div className={styles.pipelineLabel}>
                                <Calendar size={16} />
                                <span>Scheduled / Approved</span>
                            </div>
                            <div className={styles.pipelineValue}>{stats.approved}</div>
                            <div className={styles.pipelineBar}><div style={{ width: `${(stats.approved / stats.totalBookings) * 100}%`, background: '#3b82f6' }}></div></div>
                        </div>
                        <div className={styles.pipelineItem}>
                            <div className={styles.pipelineLabel}>
                                <Activity size={16} />
                                <span>In Progress</span>
                            </div>
                            <div className={styles.pipelineValue}>{stats.inProgress}</div>
                            <div className={styles.pipelineBar}><div style={{ width: `${(stats.inProgress / stats.totalBookings) * 100}%`, background: '#6366f1' }}></div></div>
                        </div>
                        <div className={styles.pipelineItem}>
                            <div className={styles.pipelineLabel}>
                                <CheckCircle size={16} />
                                <span>Completed Today</span>
                            </div>
                            <div className={styles.pipelineValue}>{stats.completed}</div>
                            <div className={styles.pipelineBar}><div style={{ width: `${(stats.completed / stats.totalBookings) * 100}%`, background: '#10b981' }}></div></div>
                        </div>
                    </div>
                </Card>

                <Card title="System Management" className={styles.managementCard}>
                    <div className={styles.mgmtGrid}>
                        <div className={styles.mgmtItem}>
                            <Settings size={20} />
                            <span>{stats.totalServices} Active Services</span>
                        </div>
                        <div className={styles.mgmtItem}>
                            <Calendar size={20} />
                            <span>{stats.totalBookings} Lifetime Bookings</span>
                        </div>
                        <div className={styles.mgmtItem}>
                            <Users size={20} />
                            <span>{stats.totalCustomers} Registered Clients</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;

