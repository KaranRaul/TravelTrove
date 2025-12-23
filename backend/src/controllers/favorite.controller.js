const Favorite = require("../models/Favorite");

// ADD FAVORITE
exports.addFavorite = async (req, res, next) => {
    try {
        const { type, id } = req.body;

        if (!type || !id) {
            return res.status(400).json({ error: "Invalid request body" });
        }

        const payload = {
            user: req.user._id,
            type,
        };

        if (type === "destination-guide") {
            payload.destinationGuide = id;
        } else if (type === "trip-itinerary") {
            payload.tripItinerary = id;
        }

        const existing = await Favorite.findOne(payload);
        if (existing) {
            return res.status(400).json({ error: "Already added to favorites" });
        }

        await Favorite.create(payload);

        res.status(201).json({ message: "Added to favorites" });
    } catch (error) {
        next(error);
    }
};

// VIEW FAVORITES
exports.getFavorites = async (req, res, next) => {
    try {
        const favorites = await Favorite.find({ user: req.user._id })
            .populate("destinationGuide", "title")
            .populate("tripItinerary", "destination");

        res.status(200).json({ favorites });
    } catch (error) {
        next(error);
    }
};

// REMOVE FAVORITE
exports.removeFavorite = async (req, res, next) => {
    try {
        const favorite = await Favorite.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!favorite) {
            return res.status(404).json({ error: "Favorite not found" });
        }

        res.status(200).json({
            message: "Favorite removed successfully",
        });
    } catch (error) {
        next(error);
    }
};
