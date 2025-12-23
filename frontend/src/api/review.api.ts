import api from "./axios";

export const getReviews = (destinationId: string) => {
    return api.get(`/reviews/${destinationId}`);
};

export const addReview = (
    destinationId: string,
    rating: number,
    comment: string
) => {
    return api.post(`/reviews/${destinationId}`, { rating, comment });
};

export const deleteReview = (reviewId: string) => {
    return api.delete(`/reviews/delete/${reviewId}`);
};
