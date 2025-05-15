// index.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/connectDB.js";
import authRoutes from "./src/routes/authRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";


// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: "*", // your frontend URL
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
