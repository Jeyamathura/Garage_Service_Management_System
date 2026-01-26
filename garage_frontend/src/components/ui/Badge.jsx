import React from 'react';
import './Badge.css';

const Badge = ({ children, status = 'default', className = '' }) => {
    return (
        <span className={`badge badge-${status.toLowerCase()} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
