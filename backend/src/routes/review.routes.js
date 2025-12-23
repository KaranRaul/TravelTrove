// const express = require("express");
// const router = express.Router({ mergeParams: true });
// const reviewController = require("../controllers/review.controller");
// const protect = require("../middlewares/auth.middleware");

// router.post("/", protect, reviewController.addReview);
// router.get("/", reviewController.getReviews);

// module.exports = router;
const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const reviewController = require("../controllers/review.controller");

router.post(
    "/:destinationId",
    protect,
    reviewController.addReview
);

router.get(
    "/:destinationId",
    reviewController.getReviews
);

router.delete(
    "/delete/:reviewId",
    protect,
    reviewController.deleteReview
);

module.exports = router;
