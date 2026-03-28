import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import calendarRoutes from "./routes/calendarRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/calendar", calendarRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal Server Error",
    error: err.toString(),
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export default app;
