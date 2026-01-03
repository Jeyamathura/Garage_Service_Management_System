import api from "./axios";

export const loginRequest = async (credentials) => {
  const response = await api.post("/token/", credentials); // username + password
  return response.data;
};

export const registerCustomer = async ({ username, password, first_name, last_name, email }) => {
  const response = await api.post("/auth/register/", { username, password, first_name, last_name, email });
  return response.data;
};