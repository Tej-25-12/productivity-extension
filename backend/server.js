const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ FIXED connection (no extra options needed in Mongoose v7+)
mongoose.connect("mongodb://127.0.0.1:27017/productivity")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Schema
const siteSchema = new mongoose.Schema({
  domain: String,
  totalTime: Number,
  date: { type: Date, default: Date.now },
});

const Site = mongoose.model("Site", siteSchema);

// Save data
app.post("/save", async (req, res) => {
  const { domain, totalTime } = req.body;
  const site = new Site({ domain, totalTime });
  await site.save();
  res.json({ message: "Data saved!" });
});

// Get daily report
app.get("/report", async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const report = await Site.find({ date: { $gte: today } });
  res.json(report);
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
