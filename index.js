require('dotenv').config();

const express = require('express');
const swaggerUi = require('swagger-ui-express');

const userRoutes = require('./routes/user_route');
const postRoutes = require('./routes/post_route');
const categoryRoutes = require('./routes/category_route');

const swaggerDocument = require('./utils/swagger');

const app = express();
const PORT = 3000;


// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());


// ===============================
// STATIC FILE (UNTUK AKSES GAMBAR)
// ===============================

app.use('/images', express.static('public/images'));


// ===============================
// ROUTES
// ===============================

// Auth / User
app.use('/', userRoutes);

// Posts
app.use('/', postRoutes);

// Categories (pakai prefix /api biar rapi)
app.use('/api', categoryRoutes);


// ===============================
// SWAGGER DOCUMENTATION
// ===============================

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// ===============================
// RUN SERVER
// ===============================

app.listen(PORT, () => {
    console.log(`🚀 Server running : http://localhost:${PORT}`);
    console.log(`📘 Swagger docs  : http://localhost:${PORT}/api-docs`);
});