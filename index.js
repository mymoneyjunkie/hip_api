const express = require("express");

require('dotenv').config();

const cors = require('cors');

const cookieParser = require("cookie-parser");

const authRoute = require("./routes/auth");

const refreshRoute = require("./routes/refreshRoute");

const logoutRoute = require("./routes/logoutRoute");

const allowedOrigins = require("./config/allowedOrigins");

const webUserRoute = require("./routes/user_web");

const newsUserRoute = require("./routes/user_news");

const adminWebRoute = require("./routes/admin_web");

const adminNewsRoute = require("./routes/admin_news");

const adminMusicRoute = require("./routes/admin_music");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: allowedOrigins, // Your frontend URL
    methods: ["GET", "POST"],
    credentials: true
}));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/refresh", refreshRoute);
app.use("/api/v1/logout", logoutRoute);

app.use("/api/v1/user_web", webUserRoute);
app.use("/api/v1/user_news", newsUserRoute);
app.use("/api/v1/admin_web", adminWebRoute);
app.use("/api/v1/admin_news", adminNewsRoute);
app.use("/api/v1/admin_music", adminMusicRoute);

app.listen(PORT, '0.0.0.0', () => console.info(`Listening to localhost PORT ${PORT}...`))