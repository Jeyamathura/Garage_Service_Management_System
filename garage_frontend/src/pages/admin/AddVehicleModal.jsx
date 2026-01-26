import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createVehicle, updateVehicle } from "../../api/vehicle.api";
import { getCustomers } from "../../api/customer.api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import { User, Car, Tag, Plus, Pencil } from "lucide-react";

const AddVehicleModal = ({ isOpen, onClose, onVehicleAdded, vehicle }) => {
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
            if (vehicle) {
                setFormData({
                    customer_id: vehicle.customer?.id || "",
                    vehicle_number: vehicle.vehicle_number,
                    vehicle_type: vehicle.vehicle_type,
                });
            } else {
                setFormData({ customer_id: "", vehicle_number: "", vehicle_type: "" });
            }
        }
    }, [isOpen, vehicle]);

    const fetchCustomers = async () => {
        try {
            const data = await getCustomers();
            setCustomers(data);
        } catch (error) {
            console.error("Failed to fetch customers", error);
        }
    };

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
            if (vehicle) {
                await updateVehicle(vehicle.id, formData);
                toast.success("Vehicle records updated successfully");
            } else {
                await createVehicle(formData);
                toast.success("Vehicle added safely to the fleet");
            }
            onVehicleAdded();
            onClose();
        } catch (error) {
            toast.error("Failed to add vehicle. Please verify input details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={vehicle ? "Update Vehicle Details" : "Register New Vehicle"}
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>Discard</Button>
                    <Button onClick={handleSubmit} loading={loading} icon={vehicle ? Pencil : Plus}>
                        {vehicle ? "Update Repository" : "Add Vehicle"}
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="input-field">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Assign to Customer</label>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                        <select
                            name="customer_id"
                            value={formData.customer_id}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem 0.75rem 2.75rem',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.875rem',
                                outline: 'none',
                                background: 'white',
                                appearance: 'none'
                            }}
                        >
                            <option value="">Select a registered customer...</option>
                            {customers.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.user?.first_name} {c.user?.last_name} (@{c.user?.username})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <Input
                    label="Vehicle Plate Number"
                    name="vehicle_number"
                    value={formData.vehicle_number}
                    onChange={handleChange}
                    required
                    icon={Car}
                    placeholder="e.g. WP ABC-1234"
                />

                <Input
                    label="Vehicle Classification"
                    name="vehicle_type"
                    value={formData.vehicle_type}
                    onChange={handleChange}
                    required
                    icon={Tag}
                    placeholder="e.g. Luxury Sedan, SUV, Motorcycle"
                />
            </form>
        </Modal>
    );
};

export default AddVehicleModal;

