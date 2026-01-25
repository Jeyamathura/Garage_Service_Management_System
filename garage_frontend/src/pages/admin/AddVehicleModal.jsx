import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createVehicle } from "../../api/vehicle.api";
import { getCustomers } from "../../api/customer.api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const AddVehicleModal = ({ isOpen, onClose, onVehicleAdded }) => {
    const [formData, setFormData] = useState({
        customer_id: "",
        vehicle_number: "",
        vehicle_type: "",
    });
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchCustomers();
        }
    }, [isOpen]);

    const fetchCustomers = async () => {
        try {
            const data = await getCustomers();
            setCustomers(data);
        } catch (error) {
            console.error("Failed to fetch customers", error);
        }
    };

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.customer_id) {
            toast.error("Please select a customer");
            return;
        }
        setLoading(true);
        try {
            await createVehicle(formData);
            toast.success("Vehicle added successfully!");
            onVehicleAdded();
            onClose();
            setFormData({ customer_id: "", vehicle_number: "", vehicle_type: "" });
        } catch (error) {
            console.error("Failed to add vehicle", error);
            toast.error("Failed to add vehicle. Check details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-teal-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-teal-800">Add New Vehicle</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-teal-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="input-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Customer
                        </label>
                        <select
                            name="customer_id"
                            value={formData.customer_id}
                            onChange={handleChange}
                            required
                            className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
                        >
                            <option value="">Choose a customer...</option>
                            {customers.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.user?.first_name} {c.user?.last_name} ({c.user?.username})
                                </option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Vehicle Number"
                        name="vehicle_number"
                        value={formData.vehicle_number}
                        onChange={handleChange}
                        required
                        placeholder="e.g., ABC-1234"
                    />
                    <Input
                        label="Vehicle Type"
                        name="vehicle_type"
                        value={formData.vehicle_type}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Car, Bike"
                    />

                    <div className="flex gap-4 mt-8">
                        <Button variant="secondary" type="button" onClick={onClose} className="flex-1 rounded-xl h-11">
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            className="flex-1 rounded-xl h-11 bg-gradient-to-r from-teal-600 to-emerald-600 border-none"
                            disabled={loading}
                        >
                            {loading ? "Adding..." : "Add Vehicle"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddVehicleModal;
