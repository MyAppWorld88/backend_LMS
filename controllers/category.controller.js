const Category = require('../models/category');


// CREATE CATEGORY
const createCategory = async (req, res) => {
    try {

        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }

        const existingCategory = await Category.findOne({
            libraryId: req.user.libraryId,
            name: name.trim().toLowerCase()
        });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category already exists'
            });
        }

        const category = await Category.create({
            libraryId: req.user.libraryId,
            name: name.trim()
        });

        return res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};


// GET ALL CATEGORIES
const getCategories = async (req, res) => {
    try {

        const categories = await Category
            .find({
                libraryId: req.user.libraryId
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};


// UPDATE CATEGORY
const updateCategory = async (req, res) => {
    try {

        const { id } = req.params;

        const { name, status } = req.body;

        const category = await Category.findOne({
            _id: id,
            libraryId: req.user.libraryId
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        category.name = name ?? category.name;
        category.status = status ?? category.status;

        await category.save();

        return res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: category
        });

    } catch (error) {

        console.error(error);
      if (error.code === 11000) {
        return res.status(400).json({
            success: false,
            message: 'Category already exists'
        });
    }


        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};


// DELETE CATEGORY
const deleteCategory = async (req, res) => {
    try {

        const { id } = req.params;

        const category = await Category.findOneAndDelete({
            _id: id,
            libraryId: req.user.libraryId
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
};