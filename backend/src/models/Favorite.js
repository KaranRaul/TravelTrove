const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["destination-guide", "trip-itinerary"],
            required: true,
        },
        destinationGuide: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DestinationGuide",
        },
        tripItinerary: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TripItinerary",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Favorite", favoriteSchema);
