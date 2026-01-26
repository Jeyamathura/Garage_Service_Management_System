import React from 'react';
import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    loading = false,
    icon: Icon,
    ...props
}) => {
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    const sizeClass = `btn-${size}`;

    return (
        <button
            className={`${baseClass} ${variantClass} ${sizeClass} ${className} ${loading ? 'btn-loading' : ''}`}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading && <span className="btn-spinner"></span>}
            {Icon && !loading && <Icon size={18} />}
            {children && <span className="btn-content">{children}</span>}
        </button>
    );
};

export default Button;
