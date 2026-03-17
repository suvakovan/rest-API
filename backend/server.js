import cors from "cors";
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();
  const bodyPreview =
    req.body && Object.keys(req.body).length ? JSON.stringify(req.body) : "{}";

  console.log(
    `[REQUEST] ${new Date().toISOString()} ${req.method} ${req.originalUrl} body=${bodyPreview}`
  );

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[RESPONSE] ${req.method} ${req.originalUrl} status=${res.statusCode} ${duration}ms`
    );
  });

  next();
});

let nextId = 3;
let entries = [
  {
    id: 1,
    title: "Welcome entry",
    note: "Use this API from the frontend form.",
  },
  {
    id: 2,
    title: "Second entry",
    note: "Try GET, POST, PUT, and DELETE.",
  },
];

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "simple-rest-api-backend",
    totalEntries: entries.length,
  });
});

app.get("/entries", (_req, res) => {
  res.json({
    items: entries,
    count: entries.length,
  });
});

app.get("/entries/:id", (req, res) => {
  const id = Number(req.params.id);
  const entry = entries.find((item) => item.id === id);

  if (!entry) {
    return res.status(404).json({ message: "Entry not found." });
  }

  return res.json(entry);
});

app.post("/entries", (req, res) => {
  const title = (req.body?.title || "").trim();
  const note = (req.body?.note || "").trim();

  if (!title || !note) {
    return res.status(400).json({ message: "title and note are required." });
  }

  const newEntry = {
    id: nextId,
    title,
    note,
  };

  nextId += 1;
  entries = [newEntry, ...entries];

  return res.status(201).json({
    message: "Entry created.",
    ...newEntry,
  });
});

app.put("/entries/:id", (req, res) => {
  const id = Number(req.params.id);
  const title = (req.body?.title || "").trim();
  const note = (req.body?.note || "").trim();

  if (!title || !note) {
    return res.status(400).json({ message: "title and note are required." });
  }

  const index = entries.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Entry not found." });
  }

  const updatedEntry = {
    ...entries[index],
    title,
    note,
  };

  entries[index] = updatedEntry;

  return res.json({
    message: "Entry updated.",
    ...updatedEntry,
  });
});

app.delete("/entries/:id", (req, res) => {
  const id = Number(req.params.id);
  const existing = entries.find((item) => item.id === id);

  if (!existing) {
    return res.status(404).json({ message: "Entry not found." });
  }

  entries = entries.filter((item) => item.id !== id);

  return res.json({
    message: "Entry deleted.",
    id,
  });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
