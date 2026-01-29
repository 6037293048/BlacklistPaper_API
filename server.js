const express = require("express");
const app = express();

app.use(express.json());

const API_KEY = "fKXmTzikuP24ES7wyJ95R3YCGhkLSc99";
const blacklist = new Map();

// Auth middleware
app.use((req, res, next) => {
  const key = req.headers["authorization"];
  if (key !== API_KEY) return res.sendStatus(401);
  next();
});

// Add ban
app.post("/ban", (req, res) => {
  const { uuid, reason } = req.body;
  if (!uuid) return res.status(400).send("UUID missing");

  blacklist.set(uuid, reason || "No reason provided");
  console.log("Banned:", uuid);
  res.sendStatus(200);
});

// Remove ban
app.delete("/ban/:uuid", (req, res) => {
  blacklist.delete(req.params.uuid);
  console.log("Unbanned:", req.params.uuid);
  res.sendStatus(200);
});

// Check ban
app.get("/ban/:uuid", (req, res) => {
  if (blacklist.has(req.params.uuid)) {
    res.status(200).json({ reason: blacklist.get(req.params.uuid) });
  } else {
    res.sendStatus(404);
  }
});

app.listen(3000, () => {
  console.log("Blacklist API running on port 3000");
});
