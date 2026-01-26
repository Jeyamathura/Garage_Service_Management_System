import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    getServices,
    createService,
    updateService,
    deleteService,
} from "../../api/service.api";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";

const Services = () => {
    const [services, setServices] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentService, setCurrentService] = useState(null);
    const [formData, setFormData] = useState({
        service_name: "",
        description: "",
        price: "",
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const data = await getServices();
            setServices(data);
        } catch (error) {
            console.error("Failed to fetch services", error);
            toast.error("Failed to load services");
        }
    };

    const handleOpenModal = (service = null) => {
        if (service) {
            setCurrentService(service);
            setFormData({
                service_name: service.service_name,
                description: service.description,
                price: service.price,
            });
        } else {
            setCurrentService(null);
            setFormData({ service_name: "", description: "", price: "" });
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
            toast.success(
                currentService
                    ? "Service updated successfully"
                    : "Service created successfully"
            );
        } catch (error) {
            console.error("Failed to save service", error);
            toast.error("Failed to save service");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this service?")) {
            try {
                await deleteService(id);
                fetchServices();
                toast.success("Service deleted successfully");
            } catch (error) {
                console.error("Failed to delete service", error);
                toast.error("Failed to delete service");
            }
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-teal-800">Service Management</h1>
                <Button
                    variant="primary"
                    onClick={() => handleOpenModal()}
                    className="rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 border-none shadow-md hover:shadow-lg transition-all"
                >
                    Add New Service
                </Button>
            </div>

            <Table headers={["Service Name", "Description", "Price", "Actions"]}>
                {services.map((service) => (
                    <tr key={service.id} className="hover:bg-teal-50/50 transition-colors">
                        <td>
                            <div className="font-bold text-teal-700">{service.service_name}</div>
                        </td>
                        <td>
                            <div className="text-sm text-gray-600 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                                {service.description || <span className="text-gray-300 italic">No description</span>}
                            </div>
                        </td>
                        <td>
                            <div className="text-emerald-600 font-bold">
                                Rs. {parseFloat(service.price).toFixed(2)}
                            </div>
                        </td>
                        <td>
                            <div className="flex gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handleOpenModal(service)}
                                    className="rounded-lg px-4 border-teal-200 text-teal-700 hover:bg-teal-50"
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(service.id)}
                                    className="rounded-lg px-4"
                                >
                                    Delete
                                </Button>
                            </div>
                        </td>
                    </tr>
                ))}
            </Table>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentService ? "EDIT SERVICE" : "ADD NEW SERVICE"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Service Name"
                        name="service_name"
                        value={formData.service_name}
                        onChange={handleChange}
                        required
                        placeholder="Enter service name"
                        className="rounded-xl h-11"
                    />
                    <Input
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter service description"
                        className="rounded-xl h-11"
                    />
                    <Input
                        label="Price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        placeholder="0.00"
                        className="rounded-xl h-11"
                    />
                    <div className="flex justify-end gap-3 mt-8">
                        <Button
                            variant="secondary"
                            onClick={handleCloseModal}
                            className="rounded-xl px-6"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="rounded-xl bg-teal-600 border-none px-8 shadow-md hover:shadow-lg transition-all"
                        >
                            {currentService ? "Update Service" : "Create Service"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Services;
