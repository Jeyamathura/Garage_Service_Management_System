import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { getBookings, createBooking } from "../../api/booking.api";
import { getVehicles } from "../../api/vehicle.api";
import { getServices } from "../../api/service.api";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import {
  Plus,
  Calendar,
  Car,
  Wrench,
  Clock,
  Filter,
  Search,
} from "lucide-react";

import styles from "./Bookings.module.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    vehicle_id: "",
    service_id: "",
    preferred_date: "",
  });

  const location = useLocation();

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBookings();
      setBookings(data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    if (location.state?.selectedServiceId) {
      handleOpenModal(location.state.selectedServiceId);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleOpenModal = async (preSelectedServiceId = null) => {
    try {
      const [vData, sData] = await Promise.all([getVehicles(), getServices()]);
      setVehicles(vData);
      setServices(sData);

      if (preSelectedServiceId) {
        setFormData(prev => ({ ...prev, service_id: preSelectedServiceId }));
      }

      setIsModalOpen(true);
    } catch (error) {
      toast.error("Please add a vehicle to your profile before booking.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ vehicle_id: "", service_id: "", preferred_date: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await createBooking(formData);
      fetchBookings();
      handleCloseModal();
      toast.success("Service request submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const searchLower = searchQuery.toLowerCase();
    const serviceName = booking.service?.service_name?.toLowerCase() || "";
    const vehicleNumber = booking.vehicle?.vehicle_number?.toLowerCase() || "";
    const status = booking.status?.toLowerCase() || "";
    const statusMatch = statusFilter === "ALL" || booking.status === statusFilter;

    return statusMatch && (
      serviceName.includes(searchLower) ||
      vehicleNumber.includes(searchLower) ||
      status.includes(searchLower)
    );
  });

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Service Bookings</h1>
          <p className={styles.subtitle}>Manage and track your vehicle service history.</p>
        </div>
        <Button onClick={() => handleOpenModal()} icon={Plus}>Book Service</Button>
      </header>

      <Card className={styles.tableCard} noPadding>
        <div className={styles.tableActions}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search bookings..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className={styles.filterWrapper}>
            <Filter size={18} className={styles.filterIcon} />
            <select
              className={styles.statusFilter}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="START">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Service Details</th>
                <th>Vehicle Info</th>
                <th>Requested Date</th>
                <th>Scheduled Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className={styles.skeletonRow}>
                    <td colSpan="5"><div className={styles.skeletonLine}></div></td>
                  </tr>
                ))
              ) : filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <div className={styles.serviceName}>{booking.service?.service_name}</div>
                      <div className={styles.bookingId}>BOOK-{booking.id.toString().padStart(4, '0')}</div>
                    </td>
                    <td>
                      <div className={styles.vehicleInfo}>
                        <Car size={14} />
                        <span>{booking.vehicle?.vehicle_number}</span>
                      </div>
                      <div className={styles.vehicleType}>{booking.vehicle?.vehicle_type}</div>
                    </td>
                    <td>
                      <div className={styles.dateInfo}>
                        <Calendar size={14} />
                        <span>{new Date(booking.preferred_date).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td>
                      {booking.scheduled_date ? (
                        <div className={`${styles.dateInfo} ${styles.scheduled}`}>
                          <Clock size={14} />
                          <span>{new Date(booking.scheduled_date).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <span className={styles.pendingText}>Pending Review</span>
                      )}
                    </td>
                    <td>
                      <Badge status={booking.status}>{booking.status}</Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className={styles.emptyState}>
                    <Wrench size={40} />
                    <p>No service requests found.</p>
                    <Button variant="outline" size="sm" onClick={() => handleOpenModal()}>Create your first booking</Button>
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
        title="Request New Service"
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
            <Button onClick={handleSubmit} loading={submitting}>Submit Request</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className={styles.bookingForm}>
          <div className={styles.formGroup}>
            <label>Which vehicle needs service?</label>
            <div className={styles.selectWrapper}>
              <Car className={styles.inputIcon} size={18} />
              <select
                name="vehicle_id"
                value={formData.vehicle_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Vehicle</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.vehicle_number} ({v.model || v.vehicle_type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>What service is required?</label>
            <div className={styles.selectWrapper}>
              <Wrench className={styles.inputIcon} size={18} />
              <select
                name="service_id"
                value={formData.service_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Service</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.service_name} - Rs. {s.price}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Your preferred date</label>
            <div className={styles.inputWrapper}>
              <Calendar className={styles.inputIcon} size={18} />
              <input
                type="date"
                name="preferred_date"
                value={formData.preferred_date}
                onChange={handleChange}
                min={getTodayDate()}
                required
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyBookings;
