const router = require('express').Router();
const category = require('../controllers/category_controller');

router.get('/categories', category.getAll);
router.get('/categories/:id', category.getById);
router.post('/categories', category.create);
router.put('/categories/:id', category.update);
router.delete('/categories/:id', category.remove);

module.exports = router;