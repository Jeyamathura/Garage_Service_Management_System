import api from "./axios";

export const loginRequest = async (credentials) => {
  const response = await api.post("/token/", credentials); // username + password
  return response.data;
};
