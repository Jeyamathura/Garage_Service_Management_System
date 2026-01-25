import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createBooking } from "../../api/booking.api";
import { getCustomers } from "../../api/customer.api";
import { getServices } from "../../api/service.api";
import { getVehicles } from "../../api/vehicle.api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const AddBookingModal = ({ isOpen, onClose, onBookingAdded }) => {
    const [formData, setFormData] = useState({
        customer_id: "",
        vehicle_id: "",
        service_id: "",
        preferred_date: "",
    });
    const [customers, setCustomers] = useState([]);
    const [allVehicles, setAllVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchInitialData();
        }
    }, [isOpen]);

    const fetchInitialData = async () => {
        try {
            const [customersData, servicesData, vehiclesData] = await Promise.all([
                getCustomers(),
                getServices(),
                getVehicles(),
            ]);
            setCustomers(customersData);
            setServices(servicesData);
            setAllVehicles(vehiclesData);
        } catch (error) {
            console.error("Failed to fetch initial data", error);
            toast.error("Failed to load form data");
        }
    };

    useEffect(() => {
        if (formData.customer_id) {
            const filtered = allVehicles.filter(
                (v) => v.customer?.id === parseInt(formData.customer_id)
            );
            setFilteredVehicles(filtered);
            setFormData((prev) => ({ ...prev, vehicle_id: "" }));
        } else {
            setFilteredVehicles([]);
        }
    }, [formData.customer_id, allVehicles]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.customer_id || !formData.vehicle_id || !formData.service_id) {
            toast.error("Please fill all required fields");
            return;
        }
        setLoading(true);
        try {
            await createBooking(formData);
            toast.success("Booking created successfully!");
            onBookingAdded();
            onClose();
            setFormData({
                customer_id: "",
                vehicle_id: "",
                service_id: "",
                preferred_date: "",
            });
        } catch (error) {
            console.error("Failed to create booking", error);
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
                toast.error("Failed to create booking. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl border border-teal-100 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-teal-800">Add New Booking</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-teal-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="input-group">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Customer</label>
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

                        <div className="input-group">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Vehicle</label>
                            <select
                                name="vehicle_id"
                                value={formData.vehicle_id}
                                onChange={handleChange}
                                required
                                disabled={!formData.customer_id}
                                className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none disabled:bg-gray-50 disabled:text-gray-400"
                            >
                                <option value="">{formData.customer_id ? "Choose a vehicle..." : "Select customer first"}</option>
                                {filteredVehicles.map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.vehicle_number} ({v.vehicle_type})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Service</label>
                        <select
                            name="service_id"
                            value={formData.service_id}
                            onChange={handleChange}
                            required
                            className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
                        >
                            <option value="">Choose a service...</option>
                            {services.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.service_name} (Rs. {parseFloat(s.price).toFixed(2)})
                                </option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Preferred Date"
                        name="preferred_date"
                        type="date"
                        value={formData.preferred_date}
                        onChange={handleChange}
                        required
                        className="rounded-xl h-11"
                    />

                    <div className="flex gap-4 mt-8">
                        <Button variant="secondary" type="button" onClick={onClose} className="flex-1 rounded-xl h-11">
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            className="flex-1 rounded-xl h-11 bg-gradient-to-r from-teal-600 to-emerald-600 border-none shadow-md hover:shadow-lg transition-all"
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create Booking"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBookingModal;
