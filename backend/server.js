import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Temporarily comment out all route imports
// import orderRoutes from "./routes/order.js";
// import productRoutes from "./routes/products.js";
// import adminRoutes from "./routes/admin.js";
// import userRoutes from "./routes/users.js";

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

// --- API Routes (Temporarily Disabled) ---
// app.use("/api/order", orderRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/users", userRoutes);

// Add a simple, guaranteed-to-work route for testing
app.get('/', (req, res) => {
  res.send('Server is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is stable and running on port ${PORT}`));