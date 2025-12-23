const TripItinerary = require("../models/TripItinerary");

// CREATE
exports.createItinerary = async (req, res, next) => {
    try {
        const { destination, duration, activities, lodging, dining } = req.body;

        if (!destination || !duration) {
            return res.status(400).json({ error: "Invalid request body" });
        }

        const itinerary = await TripItinerary.create({
            user: req.user._id,
            destination,
            duration,
            activities,
            lodging,
            dining,
        });

        res.status(201).json({
            message: "Trip itinerary created successfully",
            id: itinerary._id,
        });
    } catch (error) {
        next(error);
    }
};

// GET ALL (LOGGED-IN USER)
exports.getMyItineraries = async (req, res, next) => {
    try {
        const itineraries = await TripItinerary.find({
            user: req.user._id,
        }).sort({ createdAt: -1 });

        res.status(200).json({ itineraries });
    } catch (error) {
        next(error);
    }
};

// GET BY ID (PUBLIC)
exports.getItineraryById = async (req, res, next) => {
    try {
        const itinerary = await TripItinerary.findById(req.params.id).populate(
            "user",
            "email"
        );

        if (!itinerary) {
            return res.status(404).json({ error: "Trip itinerary not found" });
        }

        res.status(200).json(itinerary);
    } catch (error) {
        next(error);
    }
};

// UPDATE (OWNER ONLY)
exports.updateItinerary = async (req, res, next) => {
    try {
        const itinerary = await TripItinerary.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!itinerary) {
            return res.status(404).json({ error: "Itinerary not found" });
        }

        Object.assign(itinerary, req.body);
        await itinerary.save();

        res.status(200).json({ message: "Itinerary updated successfully" });
    } catch (error) {
        next(error);
    }
};

// DELETE (OWNER ONLY)
exports.deleteItinerary = async (req, res, next) => {
    try {
        const itinerary = await TripItinerary.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!itinerary) {
            return res.status(404).json({ error: "Itinerary not found" });
        }

        res.status(200).json({ message: "Itinerary deleted successfully" });
    } catch (error) {
        next(error);
    }
};
