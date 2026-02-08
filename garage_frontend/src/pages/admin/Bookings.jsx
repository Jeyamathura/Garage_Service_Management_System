import React, { useEffect, useState, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  getBookings,
  approveBooking,
  rejectBooking,
  startBooking,
  completeBooking,
  cancelBooking,
} from "../../api/booking.api";
import { createInvoice } from "../../api/invoice.api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import AddBookingModal from "./AddBookingModal";
import BookingDetails from "../../components/booking/BookingDetails";
import { confirmAction } from "../../utils/confirmation";
import {
  Plus,
  Search,
  Filter,
  Check,
  X,
  Play,
  CheckCircle,
  FileText,
  User,
  Car,
  Settings,
  Calendar,
} from "lucide-react";

import styles from "./Bookings.module.css";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedViewBooking, setSelectedViewBooking] = useState(null);
  const [scheduledDate, setScheduledDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isAddBookingModalOpen, setIsAddBookingModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [invoiceBookingId, setInvoiceBookingId] = useState(null);
  const [additionalCharge, setAdditionalCharge] = useState(0);
  const [additionalChargeDescription, setAdditionalChargeDescription] = useState("");
  const navigate = useNavigate();

  // Use a ref to track the currently selected booking for viewing
  // This avoids adding selectedViewBooking as a dependency to fetchBookings, which causes a loop
  const selectedViewBookingRef = useRef(selectedViewBooking);

  useEffect(() => {
    selectedViewBookingRef.current = selectedViewBooking;
  }, [selectedViewBooking]);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBookings();
      const validBookings = Array.isArray(data) ? data.filter(Boolean) : [];
      setBookings(validBookings);

      if (selectedViewBookingRef.current) {
        const updated = validBookings.find(b => b.id === selectedViewBookingRef.current.id);
        if (updated) {
          // Only update if there are actual changes to avoid unnecessary re-renders
          if (JSON.stringify(updated) !== JSON.stringify(selectedViewBookingRef.current)) {
            setSelectedViewBooking(updated);
          }
        }
      }
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const filteredBookings = bookings.filter(booking => {
    const searchLower = searchQuery.toLowerCase();
    const customerName = `${booking.customer?.user?.first_name} ${booking.customer?.user?.last_name}`.toLowerCase();
    const vehicleNumber = booking.vehicle?.vehicle_number?.toLowerCase() || "";
    const bookingId = `BOOK-${booking.id.toString().padStart(4, '0')}`.toLowerCase();
    const statusMatch = statusFilter === "ALL" || booking.status === statusFilter;

    return statusMatch && (
      customerName.includes(searchLower) ||
      vehicleNumber.includes(searchLower) ||
      bookingId.includes(searchLower)
    );
  });

  const handleApproveClick = (booking) => {
    setSelectedBooking(booking);
    setScheduledDate(booking.preferred_date || "");
    setIsApproveModalOpen(true);
  };

  const handleRowClick = (booking) => {
    setSelectedViewBooking(booking);
    setIsViewModalOpen(true);
  };

  const handleConfirmApprove = async (e) => {
    e.preventDefault();
    try {
      await approveBooking(selectedBooking.id, scheduledDate);
      setIsApproveModalOpen(false);
      fetchBookings();
      toast.success("Booking approved successfully");
    } catch (error) {
      toast.error("Failed to approve booking");
    }
  };

  const handleReject = async (id) => {
    confirmAction({
      title: "Reject Booking",
      message: "Are you sure you want to reject this request? The customer will be notified.",
      onConfirm: async () => {
        await rejectBooking(id);
        fetchBookings();
        toast.success("Booking rejected");
      }
    });
  };

  const handleStart = async (id) => {
    confirmAction({
      title: "Start Service",
      message: "Begin the maintenance process for this vehicle? Status will change to In Progress.",
      variant: "primary",
      onConfirm: async () => {
        await startBooking(id);
        fetchBookings();
        toast.success("Service started");
      }
    });
  };

  const handleComplete = async (id) => {
    try {
      await completeBooking(id);
      fetchBookings();
      toast.success("Service cycle completed");
    } catch (error) {
      toast.error("Failed to complete service");
    }
  };

  const handleCancel = async (id) => {
    confirmAction({
      title: "Cancel Booking",
      message: "This will permanently cancel the approved booking. Continue?",
      variant: "danger",
      onConfirm: async () => {
        try {
          await cancelBooking(id);
          fetchBookings();
          toast.success("Booking cancelled");
        } catch (error) {
          toast.error("Failed to cancel booking");
        }
      }
    });
  };



  const handleGenerateInvoiceClick = (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking.invoice) {
      navigate("../invoices", { state: { invoiceId: booking.invoice.id } });
      return;
    }

    setInvoiceBookingId(bookingId);
    setAdditionalCharge(0);
    setAdditionalChargeDescription("");
    setIsInvoiceModalOpen(true);
  };

  const handleConfirmGenerateInvoice = async (e) => {
    e.preventDefault();
    try {
      const newInvoice = await createInvoice(
        invoiceBookingId,
        additionalCharge,
        additionalChargeDescription
      );
      setIsInvoiceModalOpen(false);
      toast.success("Invoice generated!");
      navigate("../invoices", { state: { invoiceId: newInvoice.id } });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to generate invoice");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Service Pipeline</h1>
          <p className={styles.subtitle}>Manage customer requests and workshop workflow.</p>
        </div>
        <Button onClick={() => setIsAddBookingModalOpen(true)} icon={Plus}>Add New Booking</Button>
      </header>

      <Card className={styles.tableCard} noPadding>
        <div className={styles.tableActions}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by ID, Customer or Vehicle..."
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
              <option value="REJECTED">Rejected</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Vehicle & Service</th>
                <th>Preferred</th>
                <th>Scheduled</th>
                <th>Status</th>
                <th>Management</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan="7"><div className={styles.skeletonLine}></div></td></tr>
                ))
              ) : filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                <tr key={booking.id} onClick={() => handleRowClick(booking)} className={styles.clickableRow}>
                  <td>
                    <div className={styles.bookingId}>BOOK-{booking.id.toString().padStart(4, '0')}</div>
                  </td>
                  <td>
                    <div className={styles.customerName}>
                      <User size={12} />
                      {booking.customer?.user?.first_name} {booking.customer?.user?.last_name}
                    </div>
                    {booking.customer?.user?.username && (
                      <span className={styles.username}>@{booking.customer?.user?.username}</span>
                    )}
                  </td>
                  <td>
                    <div className={styles.vehicleInfo}>
                      <Car size={12} />
                      {booking.vehicle?.vehicle_number}
                    </div>
                    <div className={styles.serviceInfo}>
                      <Settings size={12} />
                      {booking.service?.service_name}
                    </div>
                  </td>
                  <td>
                    <div className={styles.dateInfo}>{booking.preferred_date || "N/A"}</div>
                  </td>
                  <td>
                    <div className={`${styles.dateInfo} ${booking.scheduled_date ? styles.scheduled : ''}`}>
                      {booking.scheduled_date || "Not set"}
                    </div>
                  </td>
                  <td>
                    <Badge status={booking.status}>{booking.status}</Badge>
                  </td>
                  <td>
                    <div className={styles.actions} onClick={e => e.stopPropagation()}>
                      {booking.status === "PENDING" && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => handleApproveClick(booking)} className={styles.approveBtn} title="Approve & Schedule"><Check size={16} /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleReject(booking.id)} className={styles.rejectBtn} title="Reject Request"><X size={16} /></Button>
                        </>
                      )}
                      {booking.status === "APPROVED" && (
                        <div className={styles.buttonGroup}>
                          <Button variant="secondary" size="sm" onClick={() => handleStart(booking.id)} icon={Play} title="Start Workshop Service">Start</Button>
                          <Button variant="ghost" size="sm" onClick={() => handleCancel(booking.id)} className={styles.rejectBtn} title="Cancel Approved Booking"><X size={16} /></Button>
                        </div>
                      )}
                      {booking.status === "IN_PROGRESS" && (
                        <Button variant="primary" size="sm" onClick={() => handleComplete(booking.id)} icon={CheckCircle} title="Finalize Maintenance Cycle">Complete</Button>
                      )}
                      {booking.status === "COMPLETED" && (
                        <Button variant="ghost" size="sm" onClick={() => handleGenerateInvoiceClick(booking.id)} icon={FileText} title="View or Manage Invoice">Invoice</Button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className={styles.emptyState}>No bookings found match your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AddBookingModal
        isOpen={isAddBookingModalOpen}
        onClose={() => setIsAddBookingModalOpen(false)}
        onBookingAdded={fetchBookings}
      />

      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        title="Approve & Schedule"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsApproveModalOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmApprove}>Confirm Approval</Button>
          </>
        }
      >
        <div className={styles.approveForm}>
          <p className={styles.formHint}>Confirm the service date for <strong>{selectedBooking?.customer?.user?.username}'s</strong> vehicle.</p>
          <Input
            label="Workshop Scheduled Date"
            type="date"
            icon={Calendar}
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            required
          />
        </div>
      </Modal>

      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title="Generate Official Invoice"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsInvoiceModalOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmGenerateInvoice}>Generate & View</Button>
          </>
        }
      >
        <div className={styles.invoiceForm}>
          <Input
            label="Additional Charges (Rs.)"
            type="number"
            step="0.01"
            min="0"
            value={additionalCharge}
            onChange={(e) => setAdditionalCharge(parseFloat(e.target.value) || 0)}
            placeholder="0.00"
          />
          <Input
            label="Description of Additional Work"
            type="text"
            value={additionalChargeDescription}
            onChange={(e) => setAdditionalChargeDescription(e.target.value)}
            placeholder="e.g., Replacement parts, specialized labor"
          />
        </div>
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Booking Overview"
        size="lg"
      >
        {selectedViewBooking && (
          <BookingDetails
            booking={selectedViewBooking}
            onUpdate={fetchBookings}
          />
        )}
      </Modal>
    </div>
  );
};

export default Bookings;

