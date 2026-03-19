import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// GET all posts
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({ orderBy: { id: "desc" } });
    res.json(posts);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET single post
app.get("/api/posts/:id", async (req, res) => {
  try {
    const post = await prisma.post.findUnique({ where: { id: Number(req.params.id) } });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST — create post
app.post("/api/posts", async (req, res) => {
  const { title, content } = req.body;
  if (!title || title.trim() === "") return res.status(400).json({ error: "Title is required" });
  if (!content || content.trim() === "") return res.status(400).json({ error: "Content is required" });
  try {
    const post = await prisma.post.create({
      data: { title: title.trim(), content: content.trim() },
    });
    res.status(201).json(post);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT — update post
app.put("/api/posts/:id", async (req, res) => {
  const { title, content } = req.body;
  if (!title || title.trim() === "") return res.status(400).json({ error: "Title is required" });
  if (!content || content.trim() === "") return res.status(400).json({ error: "Content is required" });
  try {
    const post = await prisma.post.update({
      where: { id: Number(req.params.id) },
      data: { title: title.trim(), content: content.trim() },
    });
    res.json(post);
  } catch (e) {
    if (e.code === "P2025") return res.status(404).json({ error: "Post not found" });
    res.status(500).json({ error: e.message });
  }
});

// DELETE — delete post
app.delete("/api/posts/:id", async (req, res) => {
  try {
    await prisma.post.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (e) {
    if (e.code === "P2025") return res.status(404).json({ error: "Post not found" });
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});