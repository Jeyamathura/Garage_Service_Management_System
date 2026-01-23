import React, { useEffect, useState } from "react";
import { getVehicles, deleteVehicle } from "../../api/vehicle.api";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";
import AddVehicleModal from "./AddVehicleModal";

const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchVehicles = async () => {
        try {
            const data = await getVehicles();
            setVehicles(data);
        } catch (error) {
            console.error("Failed to fetch vehicles", error);
            toast.error("Failed to load vehicles");
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this vehicle?")) {
            try {
                await deleteVehicle(id);
                fetchVehicles();
                toast.success("Vehicle deleted successfully");
            } catch (error) {
                toast.error("Failed to delete vehicle");
            }
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-teal-800">Vehicle Management</h1>
                <Button
                    variant="primary"
                    onClick={() => setIsModalOpen(true)}
                    className="rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 border-none"
                >
                    Add New Vehicle
                </Button>
            </div>

            <Table headers={["ID", "Owner", "Vehicle Number", "Type", "Joined At", "Actions"]}>
                {vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-teal-50/50 transition-colors">
                        <td className="font-semibold text-teal-700">#{vehicle.id}</td>
                        <td>
                            <div className="font-medium text-gray-900">
                                {vehicle.customer?.user?.first_name} {vehicle.customer?.user?.last_name}
                            </div>
                            <div style={{ fontSize: '0.85em', color: '#666' }}>
                                @{vehicle.customer?.user?.username || 'N/A'}
                            </div>
                        </td>
                        <td>
                            <div className="font-bold text-gray-800 tracking-wider uppercase">
                                {vehicle.vehicle_number}
                            </div>
                        </td>
                        <td>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200">
                                {vehicle.vehicle_type}
                            </span>
                        </td>
                        <td>
                            <div className="text-xs font-medium text-gray-400">
                                {new Date(vehicle.customer?.date_joined || vehicle.customer?.created_at).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </div>
                        </td>
                        <td>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete(vehicle.id)}
                                className="rounded-lg px-4"
                            >
                                Delete
                            </Button>
                        </td>
                    </tr>
                ))}
            </Table>

            <AddVehicleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onVehicleAdded={fetchVehicles}
            />
        </div>
    );
};

export default Vehicles;
