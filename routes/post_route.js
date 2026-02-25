const express = require('express');
const router = express.Router();
const postController = require('../controllers/post_controller');

router.get('/', postController.getAll);
router.get('/:id', postController.getById);
router.post('/', postController.create); // Logic MinIO dipanggil di sini
router.put('/:id', postController.update);
router.delete('/:id', postController.remove);

module.exports = router;