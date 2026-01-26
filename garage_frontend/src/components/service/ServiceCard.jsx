import React from 'react';
import styles from './ServiceCard.module.css';
import Button from '../ui/Button';
import { ChevronRight, ShieldCheck, Zap } from 'lucide-react';

const ServiceCard = ({ service, onBook }) => {
    return (
        <div className={styles.card}>
            <div className={styles.iconHeader}>
                <div className={styles.iconBox}>
                    {service.service_name.toLowerCase().includes('wash') ? <Zap size={24} /> : <ShieldCheck size={24} />}
                </div>
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>{service.service_name}</h3>
                <p className={styles.description}>{service.description || "Premium service tailored for your vehicle's longevity and performance."}</p>
            </div>

            <div className={styles.priceSection}>
                <span className={styles.priceLabel}>Professional Charge</span>
                <span className={styles.priceValue}>Rs. {parseFloat(service.charge || service.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>

            <div className={styles.footer}>
                <Button
                    onClick={() => onBook(service)}
                    fullWidth
                    variant="primary"
                    icon={ChevronRight}
                >
                    Book Appointment
                </Button>
            </div>
        </div>
    );
};

export default ServiceCard;

