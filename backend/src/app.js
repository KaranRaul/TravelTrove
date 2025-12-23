const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth.routes");
const destinationRoutes = require("./routes/destination.routes");
const itineraryRoutes = require("./routes/itinerary.routes");
const favoriteRoutes = require("./routes/favorite.routes");
const chatRoutes = require("./routes/chat.routes");
const userRoutes = require("./routes/user.routes");
const reviewRoutes = require("./routes/review.routes");

const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("TravelTrove API is running");
});


app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/destination-guides", destinationRoutes);
app.use("/api/v1/trip-itineraries", itineraryRoutes);
app.use("/api/v1/favorites", favoriteRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use(errorMiddleware);

module.exports = app;
