import api from "./axios";

export const createItinerary = (data: {
    destination: string;
    duration: string;
    activities: string[];
    lodging: string;
    dining: string;
}) => {
    return api.post("/trip-itineraries", data);
};



export const getItineraryById = (id: string) => {
    return api.get(`/trip-itineraries/${id}`);
};

export const getMyItineraries = () => {
    return api.get("/trip-itineraries");
};

export const deleteItinerary = (id: string) => {
    return api.delete(`/trip-itineraries/${id}`);
};

export const updateItinerary = (id: string, data: any) => {
    return api.put(`/trip-itineraries/${id}`, data);
};