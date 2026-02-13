const express = require("express");
const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const apiKey = process.env.API_KEY;
const dbPath =
  process.env.DATABASE_PATH ||
  path.join(__dirname, "..", "data", "blacklist.db");

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS bans (
    uuid TEXT PRIMARY KEY,
    reason TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

const isUuid = (value) =>
  typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );

const requireAuth = (req, res, next) => {
  if (!apiKey) {
    return res.status(500).json({ error: "API_KEY is not configured" });
  }

  const header = req.get("Authorization");
  if (!header || header !== apiKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return next();
};

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/ban/:uuid", requireAuth, (req, res) => {
  const { uuid } = req.params;

  if (!isUuid(uuid)) {
    return res.status(400).json({ error: "Invalid uuid" });
  }

  const row = db.prepare("SELECT uuid, reason FROM bans WHERE uuid = ?").get(uuid);

  if (!row) {
    return res.status(404).json({ error: "Not banned" });
  }

  return res.status(200).json(row);
});

app.post("/ban", requireAuth, (req, res) => {
  const { uuid, reason } = req.body || {};

  if (!isUuid(uuid)) {
    return res.status(400).json({ error: "Invalid uuid" });
  }

  const finalReason =
    typeof reason === "string" && reason.trim() ? reason.trim() : "No reason provided";

  db.prepare(
    "INSERT INTO bans (uuid, reason) VALUES (?, ?) ON CONFLICT(uuid) DO UPDATE SET reason = excluded.reason, updated_at = CURRENT_TIMESTAMP"
  ).run(uuid, finalReason);

  return res.status(200).json({ ok: true });
});

app.delete("/ban/:uuid", requireAuth, (req, res) => {
  const { uuid } = req.params;

  if (!isUuid(uuid)) {
    return res.status(400).json({ error: "Invalid uuid" });
  }

  const info = db.prepare("DELETE FROM bans WHERE uuid = ?").run(uuid);

  return res.status(200).json({ removed: info.changes > 0 });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Blacklist API listening on port ${port}`);
});
