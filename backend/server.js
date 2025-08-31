import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import orderRoutes from "./routes/order.js";
import productRoutes from "./routes/products.js";
import admin from "./routes/admin.js"
import { fileURLToPath } from "url";
import users from "./routes/users.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// ✅ CORS + JSON middleware FIRST
app.use(cors({
  origin: "*", // frontend (Vite)
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true
}));
app.use(express.json());

// ✅ Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));
app.use("/images", express.static(path.join(process.cwd(), "public/images")));

// ✅ Routes
app.use("/api/order", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", admin)
app.use("/api/users", users)
// ✅ DB connection (non-promise API)
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "ammar_group"
});

db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL");
  }
});

// ✅ Example products route
app.get("/api/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const formatted = results.map(row => ({
      id: row.id,
      name: row.name,
      price: row.price,
      image: row.image,
      brand: row.brand,
      category: row.category || "General",
      description: row.description,
      rating: row.rating || 4.5,
      inStock: row.inStock !== undefined ? row.inStock : true,
      featured: row.featured !== undefined ? row.featured : false
    }));

    res.json(formatted);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
