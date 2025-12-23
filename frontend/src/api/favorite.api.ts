import api from "./axios";

export const addFavorite = (type: "destination-guide" | "trip-itinerary", id: string) => {
    return api.post("/favorites", { type, id });
};

export const getFavorites = () => {
    return api.get("/favorites");
};

export const removeFavorite = (favoriteId: string) => {
    return api.delete(`/favorites/${favoriteId}`);
};
