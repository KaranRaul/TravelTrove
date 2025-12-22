import api from "./axios";

export const searchDestinations = (query: string) => {
    return api.get(`/destination-guides/search?query=${query}`);
};

export const getDestinationById = (id: string) => {
    return api.get(`/destination-guides/${id}`);
};
