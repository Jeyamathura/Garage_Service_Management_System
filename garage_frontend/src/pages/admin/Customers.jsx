import React, { useEffect, useState } from "react";
import { getCustomers, updateCustomerProfile, toggleCustomerStatus } from "../../api/customer.api";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import AddCustomerModal from "./AddCustomerModal";
import AddBookingModal from "./AddBookingModal";
import toast from "react-hot-toast";
import {
  Plus,
  Search,
  User,
  Mail,
  Phone,
  Calendar,
  Check,
  X,
  PlusCircle,
  Filter,
  Pencil,
  Shield,
  ShieldOff
} from "lucide-react";

import styles from "./Customers.module.css";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedCustomerIdForBooking, setSelectedCustomerIdForBooking] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editValues, setEditValues] = useState({});

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      const validCustomers = data.filter(
        (customer) => customer && customer.user && customer.user.username
      );
      setCustomers(validCustomers);
    } catch (error) {
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleEditClick = (customer) => {
    setEditingId(customer.id);
    setEditValues({
      first_name: customer.user?.first_name || "",
      last_name: customer.user?.last_name || "",
      email: customer.user?.email || "",
      phone: customer.phone || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleSaveEdit = async (id) => {
    try {
      await updateCustomerProfile(id, {
        phone: editValues.phone,
        user: {
          first_name: editValues.first_name,
          last_name: editValues.last_name,
          email: editValues.email,
        }
      });
      setEditingId(null);
      fetchCustomers();
      toast.success("Customer updated successfully");
    } catch (error) {
      const errorMsg = error.response?.data?.phone?.[0] ||
        error.response?.data?.user?.email?.[0] ||
        "Failed to update customer";
      toast.error(errorMsg);
    }
  };

  const handleToggleStatus = async (customer) => {
    const isCurrentlyActive = customer.user?.is_active;

    // Only show confirmation for suspend action
    if (isCurrentlyActive) {
      toast((t) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span>Are you sure you want to suspend <strong>{customer.user?.first_name} {customer.user?.last_name}</strong>?</span>
          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>This will prevent them from logging in.</span>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                performToggle(customer);
              }}
              style={{
                padding: '0.5rem 1rem',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Yes, Suspend
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              style={{
                padding: '0.5rem 1rem',
                background: '#e2e8f0',
                color: '#475569',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ), { duration: 10000 });
      return;
    }

    performToggle(customer);
  };

  const performToggle = async (customer) => {
    try {
      const response = await toggleCustomerStatus(customer.id);

      setCustomers(prevCustomers => prevCustomers.map(c => {
        if (c.id === customer.id) {
          return {
            ...c,
            user: { ...c.user, is_active: response.is_active }
          };
        }
        return c;
      }));

      if (response.is_active) {
        toast.success(`Customer activated successfully`);
      } else {
        toast(`Customer suspended`, {
          icon: '⚠️',
          style: {
            background: '#fef2f2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
            fontWeight: '600'
          }
        });
      }
    } catch (error) {
      toast.error("Failed to update customer status");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = `${customer.user?.first_name} ${customer.user?.last_name}`.toLowerCase();
    const username = customer.user?.username?.toLowerCase() || "";
    const email = customer.user?.email?.toLowerCase() || "";
    const phone = customer.phone?.toLowerCase() || "";

    return fullName.includes(searchLower) ||
      username.includes(searchLower) ||
      email.includes(searchLower) ||
      phone.includes(searchLower);
  });

  const handleOpenBookingModal = (customerId) => {
    setSelectedCustomerIdForBooking(customerId);
    setIsBookingModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Customer Directory</h1>
          <p className={styles.subtitle}>Manage customer profiles and contact synchronization.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={Plus}>Add New Customer</Button>
      </header>

      <Card className={styles.tableCard} noPadding>
        <div className={styles.tableActions}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
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
                <th>Customer Identity</th>
                <th>Status</th>
                <th>Contact Details</th>
                <th>Registration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan="6"><div className={styles.skeletonLine}></div></td></tr>
                ))
              ) : filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <div className={styles.customerId}>CUST-{customer.id.toString().padStart(4, '0')}</div>
                  </td>
                  <td>
                    {editingId === customer.id ? (
                      <div className={styles.editRow}>
                        <input
                          name="first_name"
                          value={editValues.first_name}
                          onChange={handleInputChange}
                          className={styles.editInput}
                          placeholder="First Name"
                        />
                        <input
                          name="last_name"
                          value={editValues.last_name}
                          onChange={handleInputChange}
                          className={styles.editInput}
                          placeholder="Last Name"
                        />
                      </div>
                    ) : (
                      <div className={styles.customerProfile}>
                        <div className={styles.avatar}>
                          {customer.user?.first_name?.[0]}{customer.user?.last_name?.[0]}
                        </div>
                        <div>
                          <div className={styles.fullName}>{customer.user?.first_name} {customer.user?.last_name}</div>
                          <div className={styles.username}>@{customer.user?.username}</div>
                        </div>
                      </div>
                    )}
                  </td>
                  <td>
                    {customer.user?.is_active ? (
                      <Badge status="APPROVED">Active</Badge>
                    ) : (
                      <Badge status="REJECTED">Suspended</Badge>
                    )}
                  </td>
                  <td>
                    <div className={styles.contactInfo}>
                      {editingId === customer.id ? (
                        <>
                          <div className={styles.inlineInputGroup}>
                            <Mail size={14} />
                            <input name="email" value={editValues.email} onChange={handleInputChange} className={styles.editInput} />
                          </div>
                          <div className={styles.inlineInputGroup}>
                            <Phone size={14} />
                            <input name="phone" value={editValues.phone} onChange={handleInputChange} className={styles.editInput} />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className={styles.infoLink}><Mail size={14} /> {customer.user?.email}</div>
                          <div className={styles.infoLink}><Phone size={14} /> {customer.phone || "No phone"}</div>
                        </>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className={styles.dateInfo}>
                      <Calendar size={14} />
                      {new Date(customer.date_joined || customer.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      {editingId === customer.id ? (
                        <>
                          <button onClick={() => handleSaveEdit(customer.id)} className={styles.saveBtn}><Check size={16} color="green" /></button>
                          <button onClick={handleCancelEdit} className={styles.cancelBtn}><X size={16} color="red" /></button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => handleOpenBookingModal(customer.id)} className={styles.bookBtn} title="Create Booking" icon={PlusCircle} />
                          <Button variant="ghost" size="sm" onClick={() => handleEditClick(customer)} className={styles.editBtn} title="Edit Profile" icon={Pencil} />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(customer)}
                            className={customer.user?.is_active ? styles.suspendBtn : styles.activateBtn}
                            title={customer.user?.is_active ? "Suspend Customer" : "Reactivate Customer"}
                            icon={customer.user?.is_active ? ShieldOff : Shield}
                          />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className={styles.emptyState}>No customers found match your search criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCustomerAdded={fetchCustomers}
      />

      <AddBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialCustomerId={selectedCustomerIdForBooking}
        onBookingAdded={() => toast.success("Manual booking recorded!")}
      />
    </div>
  );
};

export default Customers;
