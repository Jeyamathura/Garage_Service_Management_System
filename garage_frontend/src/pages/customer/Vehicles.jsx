import React, { useEffect, useState } from 'react';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from '../../api/vehicle.api';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentVehicle, setCurrentVehicle] = useState(null);
    const [formData, setFormData] = useState({ vehicle_number: '', vehicle_type: '' });

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const data = await getVehicles();
            setVehicles(data);
        } catch (error) {
            console.error("Failed to fetch vehicles", error);
        }
    };

    const handleOpenModal = (vehicle = null) => {
        if (vehicle) {
            setCurrentVehicle(vehicle);
            setFormData({ vehicle_number: vehicle.vehicle_number, vehicle_type: vehicle.vehicle_type });
        } else {
            setCurrentVehicle(null);
            setFormData({ vehicle_number: '', vehicle_type: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentVehicle(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentVehicle) {
                await updateVehicle(currentVehicle.id, formData);
            } else {
                await createVehicle(formData);
            }
            fetchVehicles();
            handleCloseModal();
        } catch (error) {
            console.error("Failed to save vehicle", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this vehicle?")) {
            try {
                await deleteVehicle(id);
                fetchVehicles();
            } catch (error) {
                console.error("Failed to delete vehicle", error);
            }
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1>My Vehicles</h1>
                <Button onClick={() => handleOpenModal()}>Add New Vehicle</Button>
            </div>

            <Table headers={['Vehicle Number', 'Type', 'Actions']}>
                {vehicles.map((vehicle) => (
                    <tr key={vehicle.id}>
                        <td>{vehicle.vehicle_number}</td>
                        <td>{vehicle.vehicle_type}</td>
                        <td>
                            <Button variant="secondary" size="sm" onClick={() => handleOpenModal(vehicle)} className="mr-2">Edit</Button>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(vehicle.id)}>Delete</Button>
                        </td>
                    </tr>
                ))}
            </Table>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentVehicle ? "Edit Vehicle" : "Add Vehicle"}
            >
                <form onSubmit={handleSubmit}>
                    <Input
                        label="Vehicle Number"
                        name="vehicle_number"
                        value={formData.vehicle_number}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Vehicle Type"
                        name="vehicle_type"
                        value={formData.vehicle_type}
                        onChange={handleChange}
                        placeholder="e.g., Car, Bike, Auto"
                        required
                    />
                    <div className="flex justify-end mt-4">
                        <Button type="submit" variant="success">{currentVehicle ? "Update" : "Add"}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Vehicles;
