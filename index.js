require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const swaggerUi = require("swagger-ui-express");

const userRoutes = require("./routes/user_route");
const postRoutes = require("./routes/post_route");
const categoryRoutes = require("./routes/category_route");
const commentsRoutes = require("./routes/comments_route");
const swaggerDocument = require("./utils/swagger");

const app = express();
const PORT = 3000;

// ===============================
// CORS
// ===============================
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ===============================
// MIDDLEWARE
// ===============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Upload pakai memoryStorage
const upload = multer({ storage: multer.memoryStorage() });

// ===============================
// ROUTES
// ===============================

// User
app.use("/", userRoutes);

// Posts
app.use("/posts", upload.single("gambar"), postRoutes);

// Categories
app.use("/api", categoryRoutes);

// ✅ Comments (INI YANG KURANG)
app.use("/", commentsRoutes);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ===============================
app.listen(PORT, () => {
  console.log(`🚀 Server running : http://localhost:${PORT}`);
  console.log(`📘 Swagger docs  : http://localhost:${PORT}/api-docs`);
});