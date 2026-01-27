import React, { useEffect, useState } from "react";
import { getVehicles } from "../../api/vehicle.api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";
import AddVehicleModal from "./AddVehicleModal";
import {
    Plus,
    Search,
    Filter,
    Pencil
} from "lucide-react";

import styles from "./Vehicles.module.css";

const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentVehicle, setCurrentVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const data = await getVehicles();
            setVehicles(data);
        } catch (error) {
            toast.error("Failed to load vehicles");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleOpenModal = (vehicle = null) => {
        setCurrentVehicle(vehicle);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentVehicle(null);
    };

    const filteredVehicles = vehicles.filter(vehicle => {
        const searchLower = searchQuery.toLowerCase();
        const ownerName = `${vehicle.customer?.user?.first_name} ${vehicle.customer?.user?.last_name}`.toLowerCase();
        const vehicleNum = vehicle.vehicle_number.toLowerCase();
        const username = vehicle.customer?.user?.username?.toLowerCase() || "";

        return ownerName.includes(searchLower) ||
            vehicleNum.includes(searchLower) ||
            username.includes(searchLower);
    });

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Vehicle Fleet</h1>
                    <p className={styles.subtitle}>Manage all registered customer vehicles in the system.</p>
                </div>
                <Button onClick={() => handleOpenModal()} icon={Plus}>Add New Vehicle</Button>
            </header>

            <Card className={styles.tableCard} noPadding>
                <div className={styles.tableActions}>
                    <div className={styles.searchWrapper}>
                        <Search size={18} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search by number, owner or username..."
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="secondary" size="sm" icon={Filter}>Filter</Button>
                </div>

                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Vehicle Owner</th>
                                <th>Plate Number</th>
                                <th>Classification</th>
                                <th>Registered</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i}><td colSpan="6"><div className={styles.skeletonLine}></div></td></tr>
                                ))
                            ) : filteredVehicles.length > 0 ? filteredVehicles.map((vehicle) => (
                                <tr key={vehicle.id}>
                                    <td className={styles.vehicleId}>VEH-{vehicle.id.toString().padStart(4, '0')}</td>
                                    <td>
                                        <div className={styles.ownerProfile}>
                                            <div className={styles.ownerName}>
                                                {vehicle.customer?.user?.first_name} {vehicle.customer?.user?.last_name}
                                            </div>
                                            <div className={styles.username}>
                                                @{vehicle.customer?.user?.username || 'N/A'}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.vehicleNumber}>
                                            {vehicle.vehicle_number}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={styles.typeTag}>
                                            {vehicle.vehicle_type}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.dateCell}>
                                            {new Date(vehicle.created_at || (vehicle.customer?.date_joined)).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleOpenModal(vehicle)}
                                                className={styles.editBtn}
                                            >
                                                <Pencil size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className={styles.emptyState}>
                                        No vehicles found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <AddVehicleModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onVehicleAdded={fetchVehicles}
                vehicle={currentVehicle}
            />
        </div>
    );
};

export default Vehicles;

