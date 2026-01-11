import api from "./axios";

export const getCustomers = async () => {
  const response = await api.get("/customers/");
  return response.data.filter((customer) => 
    customer != null && 
    customer.user != null &&
    customer.user.username != null
  );
};


export const getCustomerProfile = async () => {
  const response = await api.get("/customers/me/");
  return response.data;
};


export const getCustomerById = async (id) => {
  const response = await api.get(`/customers/${id}/`);
  return response.data;
};

export const updateCustomerProfile = async (id, data) => {
  const response = await api.patch(`/customers/${id}/`, data);
  return response.data;
};
