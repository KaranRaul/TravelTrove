const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const itineraryController = require("../controllers/itinerary.controller");

router.post("/", protect, itineraryController.createItinerary);
router.get("/", protect, itineraryController.getMyItineraries);
router.get("/:id", itineraryController.getItineraryById);
router.put("/:id", protect, itineraryController.updateItinerary);
router.delete("/:id", protect, itineraryController.deleteItinerary);

module.exports = router;
