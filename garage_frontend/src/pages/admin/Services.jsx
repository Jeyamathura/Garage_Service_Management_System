import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    getServices,
    createService,
    updateService,
    deleteService,
} from "../../api/service.api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import {
    Plus,
    Search,
    Trash2,
    Wrench,
    Banknote,
    Pencil,
    FileText,
    Package
} from "lucide-react";

import styles from "./Services.module.css";

const Services = () => {
    const [services, setServices] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [submitting, setSubmitting] = useState(false);
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
            setLoading(true);
            const data = await getServices();
            setServices(data);
        } catch (error) {
            toast.error("Failed to load services");
        } finally {
            setLoading(false);
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
        setSubmitting(true);
        try {
            if (currentService) {
                await updateService(currentService.id, formData);
            } else {
                await createService(formData);
            }
            fetchServices();
            handleCloseModal();
            toast.success(currentService ? "Service updated" : "Service created");
        } catch (error) {
            toast.error("Failed to save service");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this service?")) {
            try {
                await deleteService(id);
                fetchServices();
                toast.success("Service deleted");
            } catch (error) {
                toast.error("Failed to delete service");
            }
        }
    };

    const filteredServices = services.filter(service => {
        const searchLower = searchQuery.toLowerCase();
        return service.service_name.toLowerCase().includes(searchLower) ||
            service.description?.toLowerCase().includes(searchLower);
    });

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Service Catalog</h1>
                    <p className={styles.subtitle}>Define and manage service packages offered by the garage.</p>
                </div>
                <Button onClick={() => handleOpenModal()} icon={Plus}>Add New Service</Button>
            </header>

            <Card className={styles.tableCard} noPadding>
                <div className={styles.tableActions}>
                    <div className={styles.searchWrapper}>
                        <Search size={18} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search services..."
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
                                <th>ID</th>
                                <th>Service Identity</th>
                                <th>Description</th>
                                <th>Standard Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i}><td colSpan="5"><div className={styles.skeletonLine}></div></td></tr>
                                ))
                            ) : filteredServices.length > 0 ? filteredServices.map((service) => (
                                <tr key={service.id}>
                                    <td>
                                        <div className={styles.serviceId}>SRV-{service.id.toString().padStart(4, '0')}</div>
                                    </td>
                                    <td>
                                        <div className={styles.serviceNameRow}>
                                            <div className={styles.iconBox}><Wrench size={16} /></div>
                                            <div className={styles.nameLabel}>{service.service_name}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.descriptionText}>
                                            {service.description || "No detailed description provided."}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.priceTag}>
                                            Rs. {parseFloat(service.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <Button variant="ghost" size="sm" onClick={() => handleOpenModal(service)} className={styles.editBtn}><Pencil size={16} /></Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(service.id)} className={styles.deleteBtn}><Trash2 size={16} /></Button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" className={styles.emptyState}>No service packages registered.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentService ? "Edit Service Plan" : "Create New Service Package"}
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                        <Button onClick={handleSubmit} loading={submitting}>{currentService ? "Update" : "Create"}</Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className={styles.form}>
                    <Input
                        label="Service Identity"
                        name="service_name"
                        value={formData.service_name}
                        onChange={handleChange}
                        icon={Package}
                        required
                        placeholder="e.g. Engine Overhaul"
                    />
                    <Input
                        label="Service Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        icon={FileText}
                        placeholder="Brief overview of what this service covers"
                    />
                    <Input
                        label="Standard Market Price (Rs.)"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        icon={Banknote}
                        required
                        placeholder="0.00"
                    />
                </form>
            </Modal>
        </div>
    );
};

export default Services;

