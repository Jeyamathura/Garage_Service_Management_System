import api from "./axios";

export const getBookings = async () => {
    const response = await api.get("/bookings/");
    return response.data;
};

export const createBooking = async (data) => {
    const response = await api.post("/bookings/", data);
    return response.data;
};

// Custom actions
export const approveBooking = async (id, scheduled_date) => {
    const response = await api.post(`/bookings/${id}/approve/`, { scheduled_date });
    return response.data;
};

export const rejectBooking = async (id) => {
    const response = await api.post(`/bookings/${id}/reject/`);
    return response.data;
};

export const startBooking = async (id) => {
    const response = await api.post(`/bookings/${id}/start/`);
    return response.data;
};

export const completeBooking = async (id) => {
    const response = await api.post(`/bookings/${id}/complete/`);
    return response.data;
};

export const updateBooking = async (id, data) => {
    const response = await api.patch(`/bookings/${id}/`, data);
    return response.data;
};

export const deleteBooking = async (id) => {
    const response = await api.delete(`/bookings/${id}/`);
    return response.data;
};
