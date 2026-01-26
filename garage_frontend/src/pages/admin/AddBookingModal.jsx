import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createBooking } from "../../api/booking.api";
import { getCustomers } from "../../api/customer.api";
import { getServices } from "../../api/service.api";
import { getVehicles } from "../../api/vehicle.api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import { User, Car, Wrench, Calendar } from "lucide-react";

const AddBookingModal = ({ isOpen, onClose, onBookingAdded, initialCustomerId }) => {
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
            if (initialCustomerId) {
                setFormData(prev => ({ ...prev, customer_id: initialCustomerId.toString() }));
            }
        } else {
            // Reset form when modal closes
            setFormData({
                customer_id: "",
                vehicle_id: "",
                service_id: "",
                preferred_date: "",
            });
        }
    }, [isOpen, initialCustomerId]);

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createBooking(formData);
            toast.success("Booking created!");
            onBookingAdded();
            onClose();
            setFormData({
                customer_id: "",
                vehicle_id: "",
                service_id: "",
                preferred_date: "",
            });
        } catch (error) {
            toast.error("Failed to create booking.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Manual Service Booking"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} loading={loading}>Create Booking</Button>
                </>
            }
        >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="input-group">
                    <label className="input-label">Select Customer</label>
                    <div className="input-wrapper">
                        <User className="input-icon" size={18} />
                        <select
                            name="customer_id"
                            value={formData.customer_id}
                            onChange={handleChange}
                            required
                            className="form-input with-icon"
                        >
                            <option value="">Search Customer...</option>
                            {customers.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.user?.first_name} {c.user?.last_name} (@{c.user?.username})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="input-group">
                    <label className="input-label">Select Vehicle</label>
                    <div className="input-wrapper">
                        <Car className="input-icon" size={18} />
                        <select
                            name="vehicle_id"
                            value={formData.vehicle_id}
                            onChange={handleChange}
                            required
                            disabled={!formData.customer_id}
                            className="form-input with-icon"
                        >
                            <option value="">{formData.customer_id ? "Choose Vehicle" : "Select customer first"}</option>
                            {filteredVehicles.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.vehicle_number} ({v.vehicle_type})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="input-group">
                    <label className="input-label">Active Service</label>
                    <div className="input-wrapper">
                        <Wrench className="input-icon" size={18} />
                        <select
                            name="service_id"
                            value={formData.service_id}
                            onChange={handleChange}
                            required
                            className="form-input with-icon"
                        >
                            <option value="">Pick Service Plan...</option>
                            {services.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.service_name} (Rs. {parseFloat(s.price).toFixed(2)})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <Input
                    label="Preferred Date"
                    name="preferred_date"
                    type="date"
                    icon={Calendar}
                    value={formData.preferred_date}
                    onChange={handleChange}
                    required
                />
            </form>
        </Modal>
    );
};

export default AddBookingModal;

