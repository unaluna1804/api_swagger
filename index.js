require("dotenv").config();
const express = require("express");
const cors = require("cors"); // ✅ TAMBAHKAN
const multer = require("multer");
const swaggerUi = require("swagger-ui-express");

const userRoutes = require("./routes/user_route");
const postRoutes = require("./routes/post_route");
const categoryRoutes = require("./routes/category_route");
const swaggerDocument = require("./utils/swagger");

const app = express();
const PORT = 3000;

// ✅ AKTIFKAN CORS PALING ATAS
app.use(
  cors({
    origin: "http://localhost:5173", // frontend kamu
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Upload pakai memoryStorage
const upload = multer({ storage: multer.memoryStorage() });

// ===============================
// ROUTES
// ===============================

app.use("/", userRoutes);

// ❗ Jangan duplikat
app.use("/posts", upload.single("gambar"), postRoutes);

app.use("/api", categoryRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`🚀 Server running : http://localhost:${PORT}`);
  console.log(`📘 Swagger docs  : http://localhost:${PORT}/api-docs`);
});