export interface Review {
    _id: string;
    rating: number;
    comment: string;
    user: {
        email: string;
        _id: string;
    };
}
