// const DestinationGuide = require("../models/DestinationGuide");

// // ADD REVIEW & RATING
// exports.addReview = async (req, res, next) => {
//     try {
//         const { rating, comment } = req.body;

//         if (!rating || rating < 1 || rating > 5) {
//             return res.status(400).json({ error: "Invalid rating" });
//         }

//         const guide = await DestinationGuide.findById(req.params.id);

//         if (!guide) {
//             return res
//                 .status(404)
//                 .json({ error: "Destination guide not found" });
//         }

//         const alreadyReviewed = guide.reviews.find(
//             (r) => r.user.toString() === req.user._id.toString()
//         );

//         if (alreadyReviewed) {
//             return res.status(400).json({ error: "Already reviewed" });
//         }

//         guide.reviews.push({
//             user: req.user._id,
//             rating,
//             comment,
//         });

//         await guide.save();

//         res.status(201).json({
//             message: "Review added successfully",
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// // GET REVIEWS
// exports.getReviews = async (req, res, next) => {
//     try {
//         const guide = await DestinationGuide.findById(req.params.id).populate(
//             "reviews.user",
//             "email"
//         );

//         if (!guide) {
//             return res
//                 .status(404)
//                 .json({ error: "Destination guide not found" });
//         }

//         res.status(200).json({
//             reviews: guide.reviews,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
const Review = require("../models/Review");

// ADD / UPDATE REVIEW
exports.addReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const { destinationId } = req.params;

        if (!rating) {
            return res.status(400).json({ error: "Rating is required" });
        }

        const review = await Review.findOneAndUpdate(
            {
                user: req.user._id,
                destinationGuide: destinationId,
            },
            {
                rating,
                comment,
            },
            {
                upsert: true,
                new: true,
            }
        );

        res.status(201).json({ message: "Review saved", review });
    } catch (error) {
        next(error);
    }
};

// GET REVIEWS FOR DESTINATION
exports.getReviews = async (req, res, next) => {
    try {
        const { destinationId } = req.params;

        const reviews = await Review.find({
            destinationGuide: destinationId,
        }).populate("user", "email");

        const avgRating =
            reviews.reduce((sum, r) => sum + r.rating, 0) /
            (reviews.length || 1);

        res.status(200).json({
            avgRating: Number(avgRating.toFixed(1)),
            count: reviews.length,
            reviews,
        });
    } catch (error) {
        next(error);
    }
};

// DELETE REVIEW
exports.deleteReview = async (req, res, next) => {
    try {
        await Review.findOneAndDelete({
            _id: req.params.reviewId,
            user: req.user._id,
        });

        res.status(200).json({ message: "Review deleted" });
    } catch (error) {
        next(error);
    }
};
