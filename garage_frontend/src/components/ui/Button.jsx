import React from 'react';

const Button = ({ children, onClick, variant = 'primary', size = 'md', type = 'button', disabled = false, className = '' }) => {
    return (
        <button
            type={type}
            className={`btn btn-${variant} btn-${size} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
