import React, { useEffect, useState } from 'react';
import { getServices, createService, updateService, deleteService } from '../../api/service.api';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

const Services = () => {
    const [services, setServices] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentService, setCurrentService] = useState(null);
    const [formData, setFormData] = useState({ service_name: '', description: '', price: '' });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const data = await getServices();
            setServices(data);
        } catch (error) {
            console.error("Failed to fetch services", error);
        }
    };

    const handleOpenModal = (service = null) => {
        if (service) {
            setCurrentService(service);
            setFormData({
                service_name: service.service_name,
                description: service.description,
                price: service.price
            });
        } else {
            setCurrentService(null);
            setFormData({ service_name: '', description: '', price: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentService(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentService) {
                await updateService(currentService.id, formData);
            } else {
                await createService(formData);
            }
            fetchServices();
            handleCloseModal();
        } catch (error) {
            console.error("Failed to save service", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this service?")) {
            try {
                await deleteService(id);
                fetchServices();
            } catch (error) {
                console.error("Failed to delete service", error);
            }
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1>Manage Services</h1>
                <Button onClick={() => handleOpenModal()}>Add New Service</Button>
            </div>

            <Table headers={['Service Name', 'Description', 'Price', 'Actions']}>
                {services.map((service) => (
                    <tr key={service.id}>
                        <td>{service.service_name}</td>
                        <td>{service.description}</td>
                        <td>Rs.{parseFloat(service.price).toFixed(2)}</td>
                        <td>
                            <Button variant="secondary" size="sm" onClick={() => handleOpenModal(service)} className="mr-2">Edit</Button>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(service.id)}>Delete</Button>
                        </td>
                    </tr>
                ))}
            </Table>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentService ? "Edit Service" : "Add Service"}
            >
                <form onSubmit={handleSubmit}>
                    <Input
                        label="Service Name"
                        name="service_name"
                        value={formData.service_name}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                    <Input
                        label="Price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                    <div className="flex justify-end mt-4">
                        <Button type="submit" variant="success">{currentService ? "Update" : "Create"}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Services;
