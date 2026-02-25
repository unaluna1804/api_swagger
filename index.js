require('dotenv').config();
const express = require('express');
const multer = require('multer'); // Wajib
const swaggerUi = require('swagger-ui-express');

const userRoutes = require('./routes/user_route');
const postRoutes = require('./routes/post_route');
const categoryRoutes = require('./routes/category_route');
const swaggerDocument = require('./utils/swagger');

const app = express();
const PORT = 3000;

// Gunakan memoryStorage agar file dikirim sebagai Buffer ke Sharp
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static('public/images'));

// ===============================
// ROUTES
// ===============================

// UBAH INI: Pakai '/' saja agar rute login/register langsung di root
app.use('/', userRoutes); 

// Tetap pakai prefix '/posts' agar rapi untuk urusan gambar
app.use('/posts', upload.single('gambar'), postRoutes);

app.use('/api', categoryRoutes);

// Gunakan prefix /posts dan pasang middleware upload
app.use('/posts', upload.single('gambar'), postRoutes);

app.use('/api', categoryRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
    console.log(`🚀 Server running : http://localhost:${PORT}`);
    console.log(`📘 Swagger docs  : http://localhost:${PORT}/api-docs`);
});