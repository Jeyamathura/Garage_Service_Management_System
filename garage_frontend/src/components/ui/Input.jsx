import React from 'react';

const Input = ({ label, type = 'text', name, value, onChange, placeholder, required = false, disabled = false }) => {
    return (
        <div className="input-group">
            {label && <label className="input-label">{label}</label>}
            <input
                className="form-input"
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
            />
        </div>
    );
};

export default Input;
