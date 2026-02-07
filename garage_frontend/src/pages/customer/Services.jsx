import React, { useEffect, useState } from 'react';
import { getServices } from '../../api/service.api';
import ServiceCard from '../../components/service/ServiceCard';
import { useNavigate } from 'react-router-dom';
import styles from './Services.module.css';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                const data = await getServices();
                setServices(data);
            } catch (error) {
                console.error("Failed to fetch services", error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const handleBook = (service) => {
        navigate('/customer/bookings', { state: { selectedServiceId: service.id } });
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Available Services</h1>
                    <p className={styles.subtitle}>Select a premium service for your vehicle</p>
                </div>
            </header>

            <div className={styles.grid}>
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className={styles.skeleton}></div>
                    ))
                ) : services.map((service) => (
                    <ServiceCard
                        key={service.id}
                        service={service}
                        onBook={handleBook}
                    />
                ))}
            </div>
        </div>
    );
};

export default Services;

