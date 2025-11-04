import express from "express";
import cors from "cors";
import authRoutes from "./routes/authroutes.js";
import userRoutes from "./routes/userroute.js";
import messageRoutes from "./routes/messageroute.js"
// import casteRoutes from "./routes/casteroutes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"]
}));

// ✅ Required for PDF download
app.use((req, res, next) => {
  res.header("Access-Control-Expose-Headers", "Content-Disposition");
  next();
});

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
// app.use("/api/castes", casteRoutes);

export { app };

