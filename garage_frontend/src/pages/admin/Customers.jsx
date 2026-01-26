import React, { useEffect, useState } from "react";
import { getCustomers, updateCustomerProfile } from "../../api/customer.api";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import AddCustomerModal from "./AddCustomerModal";
import toast from "react-hot-toast";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const fetchCustomers = () => {
    getCustomers().then((data) => {
      const validCustomers = data.filter(
        (customer) => customer && customer.user && customer.user.username
      );
      setCustomers(validCustomers);
    });
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
      console.error("Failed to update customer", error);
      const errorMsg = error.response?.data?.phone?.[0] ||
        error.response?.data?.user?.email?.[0] ||
        "Failed to update customer";
      toast.error(errorMsg);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-teal-800">Customer Management</h1>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 border-none shadow-md hover:shadow-lg transition-all"
        >
          Add New Customer
        </Button>
      </div>

      <Table headers={["ID", "Customer", "Email", "Phone", "Joined At", "Actions"]}>
        {customers.map((customer) => (
          <tr key={customer.id} className="hover:bg-teal-50/50 transition-colors">
            <td className="font-semibold text-teal-700">#{customer.id}</td>
            <td>
              {editingId === customer.id ? (
                <div className="flex gap-2">
                  <input
                    name="first_name"
                    value={editValues.first_name}
                    onChange={handleInputChange}
                    className="border rounded px-2 py-1 w-24 text-sm"
                    placeholder="First Name"
                  />
                  <input
                    name="last_name"
                    value={editValues.last_name}
                    onChange={handleInputChange}
                    className="border rounded px-2 py-1 w-24 text-sm"
                    placeholder="Last Name"
                  />
                </div>
              ) : (
                <>
                  <div className="font-medium text-gray-900">
                    {customer.user?.first_name} {customer.user?.last_name}
                  </div>
                  <div style={{ fontSize: '0.85em', color: '#666' }}>
                    @{customer.user?.username || 'N/A'}
                  </div>
                </>
              )}
            </td>
            <td>
              {editingId === customer.id ? (
                <input
                  name="email"
                  value={editValues.email}
                  onChange={handleInputChange}
                  className="border rounded px-2 py-1 w-full text-sm"
                  placeholder="Email"
                />
              ) : (
                <div className="text-sm font-medium text-teal-600">{customer.user?.email}</div>
              )}
            </td>
            <td>
              {editingId === customer.id ? (
                <input
                  name="phone"
                  value={editValues.phone}
                  onChange={handleInputChange}
                  className="border rounded px-2 py-1 w-32 text-sm"
                  placeholder="Phone"
                />
              ) : (
                <div className="text-sm font-medium text-gray-700">{customer.phone || "N/A"}</div>
              )}
            </td>
            <td>
              <div className="text-xs font-medium text-gray-400">
                {new Date(customer.date_joined || customer.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </td>
            <td>
              <div className="flex gap-2">
                {editingId === customer.id ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(customer.id)}
                      className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-400 hover:text-gray-600 font-semibold text-sm"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEditClick(customer)}
                    className="text-teal-600 hover:text-teal-700 font-semibold text-sm flex items-center gap-1"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </Table>

      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCustomerAdded={fetchCustomers}
      />
    </div>
  );
};

export default Customers;