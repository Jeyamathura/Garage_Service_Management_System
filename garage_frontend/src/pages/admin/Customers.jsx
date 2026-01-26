import React, { useEffect, useState } from "react";
import { getCustomers } from "../../api/customer.api";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import AddCustomerModal from "./AddCustomerModal";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      <Table headers={["ID", "Customer", "Email", "Phone", "Joined At"]}>
        {customers.map((customer) => (
          <tr key={customer.id} className="hover:bg-teal-50/50 transition-colors">
            <td className="font-semibold text-teal-700">#{customer.id}</td>
            <td>
              <div className="font-medium text-gray-900">
                {customer.user?.first_name} {customer.user?.last_name}
              </div>
              <div style={{ fontSize: '0.85em', color: '#666' }}>
                @{customer.user?.username || 'N/A'}
              </div>
            </td>
            <td>
              <div className="text-sm font-medium text-teal-600">{customer.user?.email}</div>
            </td>
            <td>
              <div className="text-sm font-medium text-gray-700">{customer.phone || "N/A"}</div>
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
