import React, { useEffect, useState } from "react";
import { getCustomers } from "../../api/customer.api";
import Table from "../../components/ui/Table";

const Customers = () => {
  const [customers, setCustomers]= useState([]);

  useEffect(() => {
    getCustomers().then((data) => {
      const validCustomers = data.filter(
        (customer) => customer && customer.user && customer.user.username
      );
      setCustomers(validCustomers);
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="mb-4">Registered Customers</h1>
      <Table headers={["Username", "Full Name", "Email", "Phone", "Joined At"]}>
        {customers.map((customer) => (
          <tr key={customer.id}>
            <td>{customer.user?.username}</td>
            <td>
              {customer.user?.first_name} {customer.user?.last_name}
            </td>
            <td>{customer.user?.email}</td>
            <td>{customer.phone || "N/A"}</td>
            <td>{new Date(customer.date_joined).toLocaleDateString()}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
};

export default Customers;
