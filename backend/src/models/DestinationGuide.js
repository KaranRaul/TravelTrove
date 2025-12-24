const mongoose = require("mongoose");

const destinationGuideSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            index: true,
        },
        summary: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        photos: [String],

        history: String,
        culture: String,
        attractions: [String],

        recommendations: {
            lodging: [String],
            dining: [String],
            activities: [String],
        },

    },
    { timestamps: true }
);

module.exports = mongoose.model("DestinationGuide", destinationGuideSchema);
