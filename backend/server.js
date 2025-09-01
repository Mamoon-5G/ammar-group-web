import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Import your route files
import orderRoutes from "./routes/order.js";
import productRoutes from "./routes/products.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/users.js";

// Boilerplate for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// --- Middleware ---
app.use(cors({
  origin: ["http://localhost:5173", "https://ammar-group-web.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// --- Static File Serving ---
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/images", express.static(path.join(__dirname, "public/images"))); // Adjusted for consistency
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));
app.use("/images", express.static(path.join(process.cwd(), "public/images")));
// --- API Routes ---
app.use("/api/order", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));