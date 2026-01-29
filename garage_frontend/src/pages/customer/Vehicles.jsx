import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from '../../api/vehicle.api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { confirmAction } from '../../utils/confirmation';
import {
    Car,
    Trash2,
    Plus,
    Search,
    AlertCircle,
    Pencil
} from 'lucide-react';
import styles from './Vehicles.module.css';

const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentVehicle, setCurrentVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({ vehicle_number: '', vehicle_type: '' });
    const [isOtherType, setIsOtherType] = useState(false);
    const [customType, setCustomType] = useState("");

    const predefinedTypes = ["Car", "Motorcycle", "Van", "SUV", "Truck"];

    const fetchVehicles = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getVehicles();
            setVehicles(data);
        } catch (error) {
            toast.error("Failed to load vehicles");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVehicles();
    }, [fetchVehicles]);

    const handleOpenModal = (vehicle = null) => {
        if (vehicle) {
            setCurrentVehicle(vehicle);
            const isCustom = vehicle.vehicle_type && !predefinedTypes.includes(vehicle.vehicle_type);
            setIsOtherType(isCustom);
            setCustomType(isCustom ? vehicle.vehicle_type : "");
            setFormData({
                vehicle_number: vehicle.vehicle_number,
                vehicle_type: isCustom ? "Other" : vehicle.vehicle_type
            });
        } else {
            setCurrentVehicle(null);
            setIsOtherType(false);
            setCustomType("");
            setFormData({ vehicle_number: '', vehicle_type: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentVehicle(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'vehicle_type') {
            if (value === 'Other') {
                setIsOtherType(true);
            } else {
                setIsOtherType(false);
                setCustomType("");
            }
        }
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submissionData = {
            ...formData,
            vehicle_type: isOtherType ? customType : formData.vehicle_type
        };

        if (!submissionData.vehicle_type) {
            toast.error("Please specify a vehicle type");
            return;
        }

        try {
            setSubmitting(true);
            if (currentVehicle) {
                await updateVehicle(currentVehicle.id, submissionData);
            } else {
                await createVehicle(submissionData);
            }
            fetchVehicles();
            handleCloseModal();
            toast.success(currentVehicle ? "Vehicle updated successfully" : "Vehicle added successfully");
        } catch (error) {
            toast.error("Failed to save vehicle");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        confirmAction({
            title: "Remove Vehicle",
            message: "Are you sure you want to remove this vehicle? This will also affect any associated booking history links.",
            onConfirm: async () => {
                try {
                    await deleteVehicle(id);
                    fetchVehicles();
                    toast.success("Vehicle removed successfully");
                } catch (error) {
                    toast.error("Failed to delete vehicle");
                }
            }
        });
    };

    const filteredVehicles = vehicles.filter(vehicle => {
        const searchLower = searchQuery.toLowerCase();
        return vehicle.vehicle_number.toLowerCase().includes(searchLower) ||
            vehicle.vehicle_type.toLowerCase().includes(searchLower) ||
            vehicle.model?.toLowerCase().includes(searchLower);
    });

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>My Vehicles</h1>
                    <p className={styles.subtitle}>Register and manage your vehicles for faster booking.</p>
                </div>
                <Button onClick={() => handleOpenModal()} icon={Plus}>Add Vehicle</Button>
            </header>

            <Card className={styles.contentCard} noPadding>
                <div className={styles.tableActions}>
                    <div className={styles.searchWrapper}>
                        <Search size={18} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search vehicles..."
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Vehicle Details</th>
                                <th>Type</th>
                                <th>Registered On</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array(2).fill(0).map((_, i) => (
                                    <tr key={i}><td colSpan="4"><div className={styles.skeleton}></div></td></tr>
                                ))
                            ) : filteredVehicles.length > 0 ? filteredVehicles.map((vehicle) => (
                                <tr key={vehicle.id}>
                                    <td>
                                        <div className={styles.vehicleNumber}>
                                            <Car size={16} />
                                            <span>{vehicle.vehicle_number}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={styles.typeTag}>{vehicle.vehicle_type}</span>
                                    </td>
                                    <td className={styles.dateCell}>
                                        {new Date(vehicle.created_at || Date.now()).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <Button variant="ghost" size="sm" onClick={() => handleOpenModal(vehicle)}><Pencil size={16} /></Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(vehicle.id)} className={styles.deleteBtn}><Trash2 size={16} /></Button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className={styles.emptyState}>
                                        <Car size={48} />
                                        <p>You haven't added any vehicles yet.</p>
                                        <Button variant="outline" size="sm" onClick={() => handleOpenModal()}>Add your first vehicle</Button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentVehicle ? "Edit Vehicle" : "Add New Vehicle"}
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                        <Button onClick={handleSubmit} loading={submitting}>{currentVehicle ? "Save Changes" : "Add Vehicle"}</Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className={styles.form}>
                    <Input
                        label="Vehicle Registration Number"
                        name="vehicle_number"
                        icon={AlertCircle}
                        value={formData.vehicle_number}
                        onChange={handleChange}
                        placeholder="e.g. WP ABC-1234"
                        required
                    />
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Vehicle Type</label>
                        <select
                            name="vehicle_type"
                            value={formData.vehicle_type}
                            onChange={handleChange}
                            className={styles.select}
                            required
                        >
                            <option value="">Select Type</option>
                            <option value="Car">Car</option>
                            <option value="Motorcycle">Motorcycle</option>
                            <option value="Van">Van</option>
                            <option value="SUV">SUV</option>
                            <option value="Truck">Truck</option>
                            <option value="Other">Other (Custom Type)</option>
                        </select>
                    </div>

                    {isOtherType && (
                        <div className="animate-fade-in">
                            <Input
                                label="Specify Vehicle Type"
                                name="custom_type"
                                value={customType}
                                onChange={(e) => setCustomType(e.target.value)}
                                placeholder="e.g. Electric Scooter, Tractor, etc."
                                icon={AlertCircle}
                                required
                            />
                        </div>
                    )}
                </form>
            </Modal>
        </div>
    );
};

export default Vehicles;

