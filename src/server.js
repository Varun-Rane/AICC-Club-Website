import express from "express";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// 🔹 MySQL connection using only .env
const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
});

// 🔹 JWT secret from .env
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
};

// Middleware to check if user is admin
const verifyAdmin = async (req, res, next) => {
  try {
    const [rows] = await db.query("SELECT isAdmin FROM users WHERE id = ?", [
      req.user.id,
    ]);
    if (rows.length === 0 || rows[0].isAdmin !== 1) {
      return res.status(403).json({ error: "Admins only" });
    }
    next();
  } catch (err) {
    console.error("Admin check error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ======================= AUTH ROUTES =======================

// Register
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, college, phone } = req.body;

    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, password, college, phone, isAdmin) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, hashedPassword, college, phone, 0]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) return res.status(400).json({ error: "User not found" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin === 1,
        college: user.college,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get current user
app.get("/api/user", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email, college, phone, isAdmin FROM users WHERE id = ?",
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("User fetch error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ======================= EVENTS ROUTES =======================

// Get all events
app.get("/api/events", async (req, res) => {
  try {
    const [events] = await db.query("SELECT * FROM events ORDER BY date ASC");
    res.json(events);
  } catch (err) {
    console.error("Fetch events error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create event (Admin only)
app.post("/api/events", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, description, date, location, posterImage, registrationOpen } = req.body;
    await db.query(
      "INSERT INTO events (name, description, date, location, posterImage, registrationOpen) VALUES (?, ?, ?, ?, ?, ?)",
      [name, description, date, location, posterImage, registrationOpen ? 1 : 0]
    );
    res.status(201).json({ message: "Event created successfully" });
  } catch (err) {
    console.error("Create event error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update event (Admin only)
app.put("/api/events/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, date, location, posterImage, registrationOpen } = req.body;
    await db.query(
      "UPDATE events SET name=?, description=?, date=?, location=?, posterImage=?, registrationOpen=? WHERE id=?",
      [name, description, date, location, posterImage, registrationOpen ? 1 : 0, id]
    );
    res.json({ message: "Event updated successfully" });
  } catch (err) {
    console.error("Update event error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete event (Admin only)
app.delete("/api/events/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM events WHERE id = ?", [id]);
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Delete event error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Toggle registration (Admin only)
app.put("/api/events/:id/toggle", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("UPDATE events SET registrationOpen = NOT registrationOpen WHERE id=?", [id]);
    res.json({ message: "Registration status toggled" });
  } catch (err) {
    console.error("Toggle registration error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ======================= SEED DEFAULT ADMIN =======================
const seedAdmin = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email=?", ["admin@aicc.com"]);
    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await db.query(
        "INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)",
        ["Admin", "admin@aicc.com", hashedPassword, 1]
      );
      console.log("✅ Default admin created: admin@aicc.com / admin123");
    } else {
      console.log("✅ Admin already exists");
    }
  } catch (err) {
    console.error("Admin seed error:", err);
  }
};

// ======================= START SERVER =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await seedAdmin();
});
