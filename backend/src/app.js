console.log("🔥 SERVER RUNNING ON 5050 🔥");

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const groupRoutes = require("./routes/group.routes"); // 👈 MUST EXIST

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES — MUST BE BEFORE app.listen
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes); // 👈 THIS LINE IS CRITICAL

app.get("/", (req, res) => {
  res.send("API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
