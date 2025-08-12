import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import appointmentRoutes from "./routes/Appointments.js";

await connectDB();
const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL?.split(",") ?? "*", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));

app.get("/", (req, res) => res.send("Appointment API OK"));
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));
