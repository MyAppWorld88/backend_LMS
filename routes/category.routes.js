const express = require('express');

const router = express.Router();

const {authenticate} = require('../middleware/auth.middleware');

const {createCategory,getCategories, updateCategory,deleteCategory} = require('../controllers/category.controller');


// console.log('authenticate =>', authenticate);
// console.log('createCategory =>', createCategory);
router.post('/',authenticate,createCategory);
router.get('/',authenticate,getCategories);
router.put('/:id', authenticate,updateCategory);
router.delete('/:id', authenticate,deleteCategory);

module.exports = router;