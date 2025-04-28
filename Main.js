const DB = require("./DB");
const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.port;
DB.connectDB();
const cors = require("cors");
const userRoute = require("./Routes/UserRoute");
const bookRoute = require("./Routes/BookRoute");
const wishlistRoute = require("./Routes/WishlistRoute");
const achievementRoute = require("./Routes/AchievementRoute");
const favoriteRoute = require("./Routes/FavoriteRoute");
const memorizationRoute = require("./Routes/MemorizationRoute");
const ApiError = require("./Utils/ApiError");

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("Public"));
app.use("/Uploads", express.static("Uploads"));

// Route Middlewares
app.use("/user", userRoute);
app.use("/book", bookRoute);
app.use("/wishlist", wishlistRoute);
app.use("/achievement", achievementRoute);
app.use("/favorite", favoriteRoute);
app.use("/memorization", memorizationRoute);

// Handle Error Middleware
console.log(ApiError)
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.status).json({ Message: err.message });
  } else {
    const error = new ApiError( err.message , 500);
    res.status(error.status).json({ Message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
