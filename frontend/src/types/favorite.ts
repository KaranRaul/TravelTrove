export interface FavoriteItem {
    _id: string;
    type: "destination-guide" | "trip-itinerary";
    destinationGuide?: {
        _id: string;
        title: string;
    };
    tripItinerary?: {
        _id: string;
        destination: string;
    };
}
