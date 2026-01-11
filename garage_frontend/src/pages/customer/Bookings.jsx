import React, { useEffect, useState } from 'react';
import { getBookings, createBooking } from '../../api/booking.api';
import { getVehicles } from '../../api/vehicle.api';
import { getServices } from '../../api/service.api';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import StatusBadge from '../../components/ui/StatusBadge';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [services, setServices] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ vehicle_id: '', service_id: '', preferred_date: '' });

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const data = await getBookings();
            setBookings(data);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        }
    };

    const handleOpenModal = async () => {
        // Fetch vehicles and services when opening modal
        try {
            const [vData, sData] = await Promise.all([getVehicles(), getServices()]);
            setVehicles(vData);
            setServices(sData);
            setIsModalOpen(true);
        } catch (error) {
            alert("Failed to load options. Please ensure you have added a vehicle first.");
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ vehicle_id: '', service_id: '', preferred_date: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createBooking(formData);
            fetchBookings();
            handleCloseModal();
        } catch (error) {
            console.error("Failed to create booking", error);
            alert("Failed to create booking. Make sure you selected a vehicle and service.");
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1>My Bookings</h1>
                <Button onClick={handleOpenModal}>Request New Service</Button>
            </div>

            <Table headers={['Service', 'Vehicle', 'Preferred Date', 'Scheduled Date', 'Status']}>
                {bookings.map((booking) => (
                    <tr key={booking.id}>
                        <td>{booking.service.service_name}</td>
                        <td>{booking.vehicle.vehicle_number}</td>
                        <td>{booking.preferred_date}</td>
                        <td>{booking.scheduled_date || 'Pending'}</td>
                        <td><StatusBadge status={booking.status} /></td>
                    </tr>
                ))}
            </Table>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Request Service">
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Select Vehicle</label>
                        <select
                            className="form-input"
                            name="vehicle_id"
                            value={formData.vehicle_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Select Vehicle --</option>
                            {vehicles.map(v => (
                                <option key={v.id} value={v.id}>{v.vehicle_number} ({v.vehicle_type})</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Select Service</label>
                        <select
                            className="form-input"
                            name="service_id"
                            value={formData.service_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Select Service --</option>
                            {services.map(s => (
                                <option key={s.id} value={s.id}>{s.service_name} (Rs. {s.price})</option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Preferred Date"
                        type="date"
                        name="preferred_date"
                        value={formData.preferred_date}
                        onChange={handleChange}
                        required
                    />

                    <div className="flex justify-end mt-4">
                        <Button type="submit" variant="success">Submit Request</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default MyBookings;
