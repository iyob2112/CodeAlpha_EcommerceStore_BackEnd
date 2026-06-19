const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./config/db");
const router = require("./routes");
const rateLimit = require("express-rate-limit");

const app = express();

/* ---------------- RATE LIMIT ---------------- */
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 500,
  message: {
    success: false,
    error: true,
    message: "Too many requests, try again later",
  },
});

app.use(limiter);

/* ---------------- CORS (FIXED) ---------------- */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",

  "https://e-commerce-job.vercel.app"
];

app.use( 
  cors({
    origin: function (origin, callback) {
      // allow server-to-server or Postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS blocked: Not allowed origin"));
      }
    },
    credentials: true,
  })
);

/* IMPORTANT: handle preflight requests */
app.options("*", cors());

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ---------------- ROUTES ---------------- */
app.use("/api", router);

/* ---------------- SERVER ---------------- */
const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("DB connected");
    console.log("Server running on port", PORT);
  });
});