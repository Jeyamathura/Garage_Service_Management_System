import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  getBookings,
  approveBooking,
  rejectBooking,
  startBooking,
  completeBooking,
  updateBooking,
} from "../../api/booking.api";
import { createInvoice } from "../../api/invoice.api";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import StatusBadge from "../../components/ui/StatusBadge";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import AddBookingModal from "./AddBookingModal";
import BookingDetails from "../../components/booking/BookingDetails";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedViewBooking, setSelectedViewBooking] = useState(null);
  const [scheduledDate, setScheduledDate] = useState("");
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isAddBookingModalOpen, setIsAddBookingModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [invoiceBookingId, setInvoiceBookingId] = useState(null);
  const [additionalCharge, setAdditionalCharge] = useState(0);
  const [additionalChargeDescription, setAdditionalChargeDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await getBookings();
      const validBookings = Array.isArray(data) ? data.filter(Boolean) : [];
      setBookings(validBookings);

      // Update selectedViewBooking if the modal is open to reflect changes
      if (selectedViewBooking) {
        const updated = validBookings.find(b => b.id === selectedViewBooking.id);
        if (updated) setSelectedViewBooking(updated);
      }
    } catch (error) {
      console.error("Failed to fetch bookings", error);
      toast.error("Failed to load bookings");
    }
  };

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
    if (window.confirm("Reject this booking?")) {
      await rejectBooking(id);
      fetchBookings();
      toast.success("Booking rejected");
    }
  };

  const handleStart = async (id) => {
    if (window.confirm("Start service for this booking?")) {
      await startBooking(id);
      fetchBookings();
      toast.success("Service started");
    }
  };

  const handleComplete = async (id) => {
    if (window.confirm("Mark service as completed?")) {
      await completeBooking(id);
      fetchBookings();
      toast.success("Booking completed");
    }
  };

  const handleGenerateInvoiceClick = (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking.invoice) {
      toast.error("Invoice already exists for this booking!");
      navigate("../invoices");
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
      await createInvoice(
        invoiceBookingId,
        additionalCharge,
        additionalChargeDescription
      );
      setIsInvoiceModalOpen(false);
      toast.success("Invoice generated successfully!");
      navigate("../invoices");
    } catch (error) {
      setIsInvoiceModalOpen(false);
      navigate("../invoices");
      toast.error(error.response?.data?.error || "Failed to generate invoice");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-teal-800">Booking Management</h1>
        <Button
          variant="primary"
          onClick={() => setIsAddBookingModalOpen(true)}
          className="rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 border-none shadow-md hover:shadow-lg transition-all"
        >
          Add New Booking
        </Button>
      </div>

      <Table
        headers={[
          "ID",
          "Customer",
          "Vehicle",
          "Service",
          "Preferred",
          "Scheduled",
          "Status",
          "Actions",
        ]}
      >
        {bookings.map((booking) => (
          <tr
            key={booking.id}
            className="hover:bg-teal-50/50 transition-colors cursor-pointer"
            onClick={() => handleRowClick(booking)}
          >
            <td className="font-semibold text-teal-700">#{booking.id}</td>
            <td>
              <div className="font-medium text-gray-900">
                {booking.customer?.user?.first_name} {booking.customer?.user?.last_name}
              </div>
              <div className="text-[10px] text-gray-400 font-normal">
                @{booking.customer?.user?.username || 'N/A'}
              </div>
            </td>
            <td>
              <div className="font-medium">{booking.vehicle?.vehicle_number}</div>
              <div className="text-xs text-gray-500">{booking.vehicle?.vehicle_type}</div>
            </td>
            <td>
              <div className="font-medium text-gray-900">{booking.service?.service_name}</div>
              <div className="text-[10px] text-gray-400 font-medium">
                Rs. {booking.service?.price ? parseFloat(booking.service.price).toFixed(2) : "0.00"}
              </div>
            </td>
            <td>
              <div className="text-sm font-medium text-gray-700">
                {booking.preferred_date || "N/A"}
              </div>
            </td>
            <td>
              <div className="text-sm font-semibold text-emerald-700">
                {formatDate(booking.scheduled_date)}
              </div>
            </td>
            <td>
              <StatusBadge status={booking.status} />
            </td>
            <td>
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                {booking.status === "PENDING" && (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleApproveClick(booking)}
                      className="rounded-lg px-3 py-1 text-xs"
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleReject(booking.id)}
                      className="rounded-lg px-3 py-1 text-xs"
                    >
                      Reject
                    </Button>
                  </>
                )}
                {booking.status === "APPROVED" && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleStart(booking.id)}
                    className="rounded-lg px-3 py-1 text-xs bg-indigo-600 border-none hover:bg-indigo-700"
                  >
                    Start Work
                  </Button>
                )}
                {booking.status === "IN_PROGRESS" && (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleComplete(booking.id)}
                    className="rounded-lg px-3 py-1 text-xs bg-emerald-600 border-none hover:bg-emerald-700"
                  >
                    Complete
                  </Button>
                )}
                {booking.status === "COMPLETED" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleGenerateInvoiceClick(booking.id)}
                    className="rounded-lg px-3 py-1 text-xs border-teal-200 text-teal-700 hover:bg-teal-50"
                  >
                    Generate Invoice
                  </Button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </Table>

      <AddBookingModal
        isOpen={isAddBookingModalOpen}
        onClose={() => setIsAddBookingModalOpen(false)}
        onBookingAdded={fetchBookings}
      />

      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        title="Approve Booking"
      >
        <form onSubmit={handleConfirmApprove} className="space-y-4">
          <Input
            label="Scheduled Date"
            type="date"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            required
            className="rounded-xl h-11"
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="secondary"
              onClick={() => setIsApproveModalOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-teal-600 border-none px-6"
            >
              Confirm Approval
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title="Generate Invoice"
      >
        <form onSubmit={handleConfirmGenerateInvoice} className="space-y-4">
          <Input
            label="Additional Charges (Rs.)"
            type="number"
            step="0.01"
            min="0"
            value={additionalCharge}
            onChange={(e) => setAdditionalCharge(parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className="rounded-xl h-11"
          />
          <Input
            label="Additional Charges Description"
            type="text"
            value={additionalChargeDescription}
            onChange={(e) => setAdditionalChargeDescription(e.target.value)}
            placeholder="e.g., Extra parts, labor, etc."
            className="rounded-xl h-11"
          />
          <div className="flex justify-end gap-3 mt-8">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsInvoiceModalOpen(false)}
              className="rounded-xl px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-teal-600 border-none px-6"
            >
              Generate Invoice
            </Button>
          </div>
        </form>
      </Modal>

      {/* Booking View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Booking Details"
      >
        <div className="bg-white">
          <BookingDetails
            booking={selectedViewBooking}
            onUpdate={fetchBookings}
          />
          <div className="flex justify-end p-6 border-t border-teal-50">
            <Button variant="secondary" onClick={() => setIsViewModalOpen(false)} className="rounded-xl">
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Bookings;
