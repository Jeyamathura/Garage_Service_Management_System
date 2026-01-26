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

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [scheduledDate, setScheduledDate] = useState("");
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isAddBookingModalOpen, setIsAddBookingModalOpen] = useState(false);
  const [invoiceBookingId, setInvoiceBookingId] = useState(null);
  const [additionalCharge, setAdditionalCharge] = useState(0);
  const [additionalChargeDescription, setAdditionalChargeDescription] = useState("");
  const [newScheduledDate, setNewScheduledDate] = useState("");
  const [editingBookingId, setEditingBookingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await getBookings();
      const validBookings = Array.isArray(data) ? data.filter(Boolean) : [];
      setBookings(validBookings);
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

  const handleConfirmUpdateSchedule = async (e) => {
    if (e) e.preventDefault();
    try {
      await updateBooking(editingBookingId, { scheduled_date: newScheduledDate });
      setEditingBookingId(null);
      toast.success("Schedule updated");
      fetchBookings();
    } catch (error) {
      toast.error("Failed to update schedule");
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
          <tr key={booking.id} className="hover:bg-teal-50/50 transition-colors">
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
              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                {editingBookingId === booking.id ? (
                  <div className="flex items-center gap-1 p-0.5 bg-white rounded-md border border-teal-400 shadow-md animate-in fade-in zoom-in duration-200">
                    <input
                      type="date"
                      value={newScheduledDate}
                      onChange={(e) => setNewScheduledDate(e.target.value)}
                      className="text-[11px] p-1 border-none focus:outline-none bg-transparent font-medium text-teal-800 w-28"
                      autoFocus
                    />
                    <div className="flex items-center border-l border-teal-100 pl-1">
                      <button
                        onClick={handleConfirmUpdateSchedule}
                        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                        title="Save"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setEditingBookingId(null)}
                        className="p-1 text-red-400 hover:bg-red-50 rounded transition-colors"
                        title="Cancel"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      const editableStatuses = ["PENDING", "APPROVED", "IN_PROGRESS"];
                      if (editableStatuses.includes(booking.status)) {
                        setEditingBookingId(booking.id);
                        setNewScheduledDate(booking.scheduled_date || "");
                      }
                    }}
                    className={`
                      group flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer
                      ${booking.scheduled_date
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100"
                        : "bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100"}
                      ${!["PENDING", "APPROVED", "IN_PROGRESS"].includes(booking.status)
                        ? "cursor-default opacity-80"
                        : "hover:bg-teal-50 hover:border-teal-200 active:scale-95"}
                    `}
                    title={["PENDING", "APPROVED", "IN_PROGRESS"].includes(booking.status) ? "Click to set schedule" : ""}
                  >
                    <span>{formatDate(booking.scheduled_date)}</span>
                    {["PENDING", "APPROVED", "IN_PROGRESS"].includes(booking.status) && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    )}
                  </div>
                )}
              </div>
            </td>
            <td>
              <StatusBadge status={booking.status} />
            </td>
            <td>
              <div className="flex gap-2">
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
    </div>
  );
};

export default Bookings;