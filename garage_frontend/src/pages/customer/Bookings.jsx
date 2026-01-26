import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { getBookings, createBooking } from "../../api/booking.api";
import { getVehicles } from "../../api/vehicle.api";
import { getServices } from "../../api/service.api";
import Table from "../../components/ui/Table";
import StatusBadge from "../../components/ui/StatusBadge";

import styles from "./Bookings.module.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicle_id: "",
    service_id: "",
    preferred_date: "",
  });

  const location = useLocation();

  const fetchBookings = useCallback(async () => {
    try {
      const data = await getBookings();
      setBookings(data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
      toast.error("Failed to load bookings");
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Handle pre-selected service from navigation state
  useEffect(() => {
    if (location.state?.selectedServiceId) {
      handleOpenForm(location.state.selectedServiceId);
      // Clear state to avoid reopening on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleOpenForm = async (preSelectedServiceId = null) => {
    try {
      const [vData, sData] = await Promise.all([getVehicles(), getServices()]);
      setVehicles(vData);
      setServices(sData);

      if (preSelectedServiceId) {
        setFormData(prev => ({ ...prev, service_id: preSelectedServiceId }));
      }

      setIsFormOpen(true);
      // Small delay to ensure the card is rendered before scrolling
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } catch (error) {
      toast.error(
        "Failed to load options. Please ensure you have added a vehicle first."
      );
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setFormData({ vehicle_id: "", service_id: "", preferred_date: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBooking(formData);
      fetchBookings();
      handleCloseForm();
      toast.success("Booking requested successfully!");
    } catch (error) {
      console.error("Failed to create booking", error);
      toast.error("Failed to submit request.");
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-teal-900 tracking-tight">Booking Center</h1>
          <p className="text-gray-500 mt-2 text-lg">Manage and track your premium vehicle care sessions</p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="bg-teal-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-teal-700 transition-all shadow-lg hover:shadow-teal-100 flex items-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14m-7-7h14" />
          </svg>
          Request New Service
        </button>
      </div>

      {isFormOpen && (
        <div className="mb-12 animate-in fade-in slide-in-from-top-6 duration-500">
          <div className={styles.requestCard}>
            <div className={styles.requestCardHeader}>
              <h2 className={styles.requestCardTitle}>Schedule Your Service</h2>
              <button
                onClick={handleCloseForm}
                className={styles.closeButton}
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className={styles.formGrid}>
                <div className={styles.inputField}>
                  <label className={styles.label}>Which Vehicle?</label>
                  <select
                    className={styles.select}
                    name="vehicle_id"
                    value={formData.vehicle_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose your vehicle</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.vehicle_number} — {v.vehicle_type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.inputField}>
                  <label className={styles.label}>Select Service</label>
                  <select
                    className={styles.select}
                    name="service_id"
                    value={formData.service_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Pick a service</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.service_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.inputField}>
                  <label className={styles.label}>When to expect?</label>
                  <input
                    type="date"
                    name="preferred_date"
                    className={styles.dateInput}
                    value={formData.preferred_date}
                    onChange={handleChange}
                    min={getTodayDate()}
                    required
                  />
                </div>
              </div>

              <div className={styles.submitSection}>
                <button type="submit" className={styles.submitButton}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2rem] shadow-sm border border-teal-50 overflow-hidden">
        <Table
          headers={[
            "Service Detail",
            "Vehicle Info",
            "Preferred Date",
            "Scheduled Date",
            "Status",
          ]}
        >
          {bookings.length > 0 ? bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-teal-50/20 transition-colors border-b last:border-0 border-teal-50">
              <td className="py-5">
                <div className="font-bold text-teal-900 text-base">{booking.service?.service_name}</div>
                <div className="text-xs text-gray-400 mt-1 uppercase font-semibold letter-spacing-widest">
                  ID: #{booking.id}
                </div>
              </td>
              <td className="py-5">
                <div className="font-semibold text-gray-700">{booking.vehicle?.vehicle_number}</div>
                <div className="text-xs text-gray-400">{booking.vehicle?.vehicle_type}</div>
              </td>
              <td className="py-5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-300"></span>
                  <span className="text-sm font-bold text-teal-800">{booking.preferred_date}</span>
                </div>
              </td>
              <td className="py-5">
                {booking.scheduled_date ? (
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-sm font-bold text-emerald-600">{booking.scheduled_date}</span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400 font-medium italic">Pending Approval</span>
                )}
              </td>
              <td className="py-5">
                <StatusBadge status={booking.status} />
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="5" className="text-center py-20 text-gray-400">
                You haven't requested any services yet.
              </td>
            </tr>
          )}
        </Table>
      </div>
    </div>
  );
};

export default MyBookings;