export interface CreateItineraryPayload {
    destination: string;
    duration: string;
    activities: string[];
    lodging: string;
    dining: string;
}

export interface TripItinerary {
    _id: string;
    destination: string;
    duration: string;
    activities: string[];
    lodging?: string;
    dining?: string;
    user?: {
        email: string;
    };
}
