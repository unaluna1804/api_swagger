const express = require('express');
const router = express.Router();
const postController = require('../controllers/post_controller');
const authenticateToken = require('../middlewares/auth');

// Cek folder middleware kamu, kalau namanya bukan 'upload.js' atau folder 'middleware' nggak ada, 
// baris di bawah ini yang bikin eror. 
// Kalau kamu pakai Multer langsung di route, silakan pasang di sini.
// Untuk sementara saya comment dulu biar server kamu bisa JALAN.
// const upload = require('../middleware/upload'); 

// Rute Post Utama
router.get('/', postController.getAll);
router.get('/:id', postController.getById);

// Kalau fitur upload gambar mau dipake, pastikan middleware 'upload' sudah ada
// Contoh jika tanpa middleware (hanya data teks):
router.post('/', postController.create); 
router.put('/:id', postController.update);
router.delete('/:id', postController.remove);

module.exports = router;