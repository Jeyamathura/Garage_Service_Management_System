import React, { useState } from "react";
import { registerCustomer } from "../../api/customer.api";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

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

    if (!isOpen) return null;

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all border border-teal-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-teal-800 bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                        Add New Customer
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-teal-600 transition-colors"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        placeholder="Enter username"
                    />
                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter password"
                    />
                    <div className="grid grid-cols-2 gap-4">
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
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Email address"
                    />
                    <Input
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="Phone number (10 digits)"
                    />

                    <div className="flex gap-4 mt-8">
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl h-11"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            className="flex-1 rounded-xl h-11 bg-gradient-to-r from-teal-600 to-emerald-600 border-none hover:shadow-lg hover:shadow-teal-200 transition-all"
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create Customer"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCustomerModal;
