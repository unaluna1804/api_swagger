const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category_controller');
const authenticateToken = require('../middlewares/auth'); // kalau pakai auth

router.get('/categories', categoryController.getAll);
router.get('/categories/:id', categoryController.getById);

router.post(
  '/categories',
  authenticateToken,   // hapus kalau tidak pakai auth
  categoryController.create
);

router.put(
  '/categories/:id',
  authenticateToken,
  categoryController.update
);

router.delete(
  '/categories/:id',
  authenticateToken,
  categoryController.remove
);

module.exports = router;