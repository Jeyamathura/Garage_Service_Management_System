import React from 'react';
import './Input.css';

const Input = ({ label, icon: Icon, error, ...props }) => {
    return (
        <div className={`input-group ${error ? 'has-error' : ''}`}>
            {label && <label className="input-label">{label}</label>}
            <div className="input-wrapper">
                {Icon && <Icon className="input-icon" size={18} />}
                <input
                    className={`form-input ${Icon ? 'with-icon' : ''}`}
                    {...props}
                />
            </div>
            {error && <span className="input-error-message">{error}</span>}
        </div>
    );
};

export default Input;
