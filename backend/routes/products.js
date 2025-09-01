import express from "express";
import db from "../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// ⚡ Enhanced Image Upload Setup for Multiple Images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsPath = path.join(__dirname, "../uploads");
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true });
    }
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and random number
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = file.fieldname + '-' + uniqueSuffix + ext;
    cb(null, name);
  },
});

// Enhanced multer configuration with file validation
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 10 // Maximum 10 files
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Helper function to delete old images
const deleteImageFile = async (imagePath) => {
  try {
    if (imagePath && imagePath.startsWith('/uploads/')) {
      const fullPath = path.join(__dirname, '..', imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`Deleted old image: ${imagePath}`);
      }
    }
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

// 📌 Get all products with images
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.*
      FROM products p
      ORDER BY p.id DESC
    `);

    // Get images for each product
    const productsWithImages = await Promise.all(
      rows.map(async (product) => {
        const [images] = await db.query(
          "SELECT image_url FROM product_images WHERE product_id = ? ORDER BY id ASC", 
          [product.id]
        );

        return {
          ...product,
          specifications: product.specifications ? JSON.parse(product.specifications) : [],
          features: product.features ? JSON.parse(product.features) : [],
          images: images.length > 0 ? images.map(img => img.image_url) : (product.image ? [product.image] : []),
          // Keep backward compatibility
          image: images.length > 0 ? images[0].image_url : product.image
        };
      })
    );

    res.json(productsWithImages);
  } catch (err) {
    console.error("Error fetching products:", err.message);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// 📌 Get single product with all images
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = rows[0];

    // Convert JSON text to arrays
    product.specifications = product.specifications ? JSON.parse(product.specifications) : [];
    product.features = product.features ? JSON.parse(product.features) : [];

    // Get all images for this product
    const [images] = await db.query(
      "SELECT image_url FROM product_images WHERE product_id = ? ORDER BY id ASC", 
      [id]
    );

    res.json({
      ...product,
      images: images.length > 0 ? images.map(img => img.image_url) : (product.image ? [product.image] : []),
      // Keep backward compatibility
      image: images.length > 0 ? images[0].image_url : product.image
    });
  } catch (err) {
    console.error("Error fetching product:", err.message);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// 📌 Add product with multiple images
router.post("/", upload.array("images", 10), async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const {
      name, sku, brand, category,
      description, long_description,
      price, stock_count, in_stock,
      rating, featured
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: "Product name is required" });
    }

    const specifications = req.body.specifications ? JSON.parse(req.body.specifications) : [];
    const features = req.body.features ? JSON.parse(req.body.features) : [];

    // Insert product
    const [result] = await connection.query(
      `INSERT INTO products
      (name, sku, brand, category, description, long_description, specifications, features,
       price, stock_count, in_stock, rating, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, sku || null, brand || null, category || null, 
        description || null, long_description || null,
        JSON.stringify(specifications), JSON.stringify(features),
        price || null, stock_count || 0, in_stock || 1, 
        rating || 0, featured || 0
      ]
    );

    const productId = result.insertId;

    // Handle multiple image uploads
    if (req.files && req.files.length > 0) {
      const imageInserts = req.files.map(file => [
        productId,
        `/uploads/${file.filename}`
      ]);

      await connection.query(
        "INSERT INTO product_images (product_id, image_url) VALUES ?",
        [imageInserts]
      );

      // Set the first image as the main image for backward compatibility
      await connection.query(
        "UPDATE products SET image = ? WHERE id = ?",
        [`/uploads/${req.files[0].filename}`, productId]
      );
    }

    await connection.commit();
    
    res.status(201).json({ 
      id: productId, 
      message: "Product added successfully",
      imagesUploaded: req.files?.length || 0
    });
  } catch (err) {
    await connection.rollback();
    
    // Delete uploaded files if database operation failed
    if (req.files) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, '../uploads', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    
    console.error("Error adding product:", err.message);
    res.status(500).json({ 
      error: "Failed to add product", 
      details: err.message 
    });
  } finally {
    connection.release();
  }
});

// 📌 Update product with multiple images
router.put("/:id", upload.array("images", 10), async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { id } = req.params;
    const {
      name, sku, brand, category,
      description, long_description,
      price, stock_count, in_stock,
      rating, featured, existingImages
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: "Product name is required" });
    }

    const specifications = req.body.specifications ? JSON.parse(req.body.specifications) : [];
    const features = req.body.features ? JSON.parse(req.body.features) : [];

    // Update product details
    await connection.query(
      `UPDATE products SET
        name=?, sku=?, brand=?, category=?, description=?, long_description=?,
        specifications=?, features=?, price=?, stock_count=?, in_stock=?,
        rating=?, featured=?
      WHERE id=?`,
      [
        name, sku || null, brand || null, category || null,
        description || null, long_description || null,
        JSON.stringify(specifications), JSON.stringify(features),
        price || null, stock_count || 0, in_stock || 1,
        rating || 0, featured || 0, id
      ]
    );

    // Handle existing images - get current images first
    const [currentImages] = await connection.query(
      "SELECT image_url FROM product_images WHERE product_id = ?", 
      [id]
    );

    // Parse existing images that should be kept
    const keepImages = existingImages ? JSON.parse(existingImages) : [];
    
    // Delete images that are not in the keep list
    const imagesToDelete = currentImages.filter(img => !keepImages.includes(img.image_url));
    
    if (imagesToDelete.length > 0) {
      // Delete from database
      const imageUrls = imagesToDelete.map(img => img.image_url);
      await connection.query(
        "DELETE FROM product_images WHERE product_id = ? AND image_url IN (?)",
        [id, imageUrls]
      );
      
      // Delete physical files
      imagesToDelete.forEach(img => {
        deleteImageFile(img.image_url);
      });
    }

    // Add new images if uploaded
    if (req.files && req.files.length > 0) {
      const imageInserts = req.files.map(file => [
        id,
        `/uploads/${file.filename}`
      ]);

      await connection.query(
        "INSERT INTO product_images (product_id, image_url) VALUES ?",
        [imageInserts]
      );
    }

    // Update main image (first available image)
    const [allImages] = await connection.query(
      "SELECT image_url FROM product_images WHERE product_id = ? ORDER BY id ASC LIMIT 1", 
      [id]
    );
    
    const mainImage = allImages.length > 0 ? allImages[0].image_url : null;
    await connection.query(
      "UPDATE products SET image = ? WHERE id = ?",
      [mainImage, id]
    );

    await connection.commit();
    
    res.json({ 
      message: "Product updated successfully",
      imagesUploaded: req.files?.length || 0,
      imagesDeleted: imagesToDelete.length
    });
  } catch (err) {
    await connection.rollback();
    
    // Delete uploaded files if database operation failed
    if (req.files) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, '../uploads', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    
    console.error("Error updating product:", err.message);
    res.status(500).json({ 
      error: "Failed to update product", 
      details: err.message 
    });
  } finally {
    connection.release();
  }
});

// 📌 Delete product and all associated images
router.delete("/:id", async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { id } = req.params;

    // Get all images for this product before deleting
    const [images] = await connection.query(
      "SELECT image_url FROM product_images WHERE product_id = ?", 
      [id]
    );

    // Delete from product_images table
    await connection.query("DELETE FROM product_images WHERE product_id = ?", [id]);
    
    // Delete from products table
    await connection.query("DELETE FROM products WHERE id = ?", [id]);

    // Delete physical image files
    images.forEach(img => {
      deleteImageFile(img.image_url);
    });

    await connection.commit();
    
    res.json({ 
      message: "Product and all associated images deleted successfully",
      imagesDeleted: images.length
    });
  } catch (err) {
    await connection.rollback();
    console.error("Error deleting product:", err.message);
    res.status(500).json({ 
      error: "Failed to delete product", 
      details: err.message 
    });
  } finally {
    connection.release();
  }
});

// 📌 Delete specific image from product
router.delete("/:id/images", async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    // Delete from database
    const [result] = await db.query(
      "DELETE FROM product_images WHERE product_id = ? AND image_url = ?",
      [id, imageUrl]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Delete physical file
    await deleteImageFile(imageUrl);

    // Update main image if the deleted image was the main image
    const [product] = await db.query("SELECT image FROM products WHERE id = ?", [id]);
    if (product.length > 0 && product[0].image === imageUrl) {
      const [remainingImages] = await db.query(
        "SELECT image_url FROM product_images WHERE product_id = ? ORDER BY id ASC LIMIT 1",
        [id]
      );
      
      const newMainImage = remainingImages.length > 0 ? remainingImages[0].image_url : null;
      await db.query("UPDATE products SET image = ? WHERE id = ?", [newMainImage, id]);
    }

    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error("Error deleting image:", err.message);
    res.status(500).json({ 
      error: "Failed to delete image", 
      details: err.message 
    });
  }
});

export default router;