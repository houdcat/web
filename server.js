import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let db;
const client = new MongoClient(process.env.MONGO_URI);

async function connectDB() {
  try {
    await client.connect();
    db = client.db("blogdb");
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}

// API endpoint – získání všech příspěvků
app.get("/api/posts", async (req, res) => {
  const posts = await db.collection("posts").find({}).toArray();
  res.json(posts);
});

// API endpoint – přidání nového příspěvku
app.post("/api/posts", async (req, res) => {
  const newPost = req.body;
  await db.collection("posts").insertOne(newPost);
  res.status(201).json({ message: "Post added" });
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  connectDB();
});
