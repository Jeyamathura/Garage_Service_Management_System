import React, { useState } from "react";
import { registerCustomer } from "../../api/customer.api";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import { User, Lock, Mail, Phone } from "lucide-react";

const AddCustomerModal = ({ isOpen, onClose, onCustomerAdded }) => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await registerCustomer(formData);
            toast.success("Customer created successfully!");
            onCustomerAdded();
            onClose();
            setFormData({
                username: "",
                password: "",
                first_name: "",
                last_name: "",
                email: "",
                phone: "",
            });
        } catch (error) {
            console.error("Failed to create customer", error);
            const errorData = error.response?.data;
            if (errorData) {
                Object.keys(errorData).forEach((key) => {
                    if (Array.isArray(errorData[key])) {
                        errorData[key].forEach((msg) => toast.error(`${key}: ${msg}`));
                    } else {
                        toast.error(`${key}: ${errorData[key]}`);
                    }
                });
            } else {
                toast.error("Failed to create customer. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Register New Customer"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
                    <Button onClick={handleSubmit} loading={loading} variant="primary">Create Account</Button>
                </>
            }
        >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Input
                    label="Account Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    icon={User}
                    placeholder="e.g. johndoe"
                />
                <Input
                    label="Secure Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    icon={Lock}
                    placeholder="Min 8 characters"
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Input
                        label="First Name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        placeholder="First Name"
                    />
                    <Input
                        label="Last Name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        placeholder="Last Name"
                    />
                </div>
                <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    icon={Mail}
                    placeholder="customer@example.com"
                />
                <Input
                    label="Contact Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    icon={Phone}
                    placeholder="10 digit mobile number"
                />
            </form>
        </Modal>
    );
};

export default AddCustomerModal;
