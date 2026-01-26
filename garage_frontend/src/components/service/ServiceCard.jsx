import React from 'react';
import styles from './ServiceCard.module.css';

const ServiceCard = ({ service, onBook }) => {
    return (
        <div className={styles.card}>
            <h3 className={styles.title}>{service.service_name}</h3>
            <p className={styles.description}>{service.description}</p>
            <div className={styles.footer}>
                <div className={styles.price}>
                    <span className={styles.priceLabel}>Starting from</span>
                    <span className={styles.priceValue}>Rs. {parseFloat(service.price).toFixed(2)}</span>
                </div>
                <button className={styles.bookBtn} onClick={() => onBook(service)}>
                    Book Now
                </button>
            </div>
        </div>
    );
};

export default ServiceCard;
