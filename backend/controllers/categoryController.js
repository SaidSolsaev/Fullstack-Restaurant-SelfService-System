import Category from '../models/category.js';

export const getCategoryById = async (req, res, next) => {
    const { id } = req.params;
    const restaurantId = req.user.restaurantId;

    try {
        const category = await Category.findOne({where: {id, restaurantId}});
        
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        res.status(200).json(category);
    } catch (error) {
        next(error)
    }
};

export const getAllCategories = async (req, res, next) => {
    const restaurantId = req.user.restaurantId;

    try {
        const categories = await Category.findAll({where: {restaurantId}});
        res.status(200).json(categories);
    } catch (error) {
        next(error)
    }
};

export const createCategory = async (req, res, next) => {
    const { name } = req.body;
    const restaurantId = req.user.restaurantId;
    
    try {
        const newCategory = await Category.create({ name: name, restaurantId: restaurantId });
        res.status(201).json(newCategory);
    } catch (error) {
        next(error)
    }
};

export const deleteCategory = async (req, res, next) => {
    const { id } = req.params;
    const restaurantId = req.user.restaurantId;

    try {
        const category = await Category.findOne({where: {id, restaurantId}});
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        await category.destroy();
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        next(error)
    }
};

export const updateCategory = async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const restaurantId = req.user.restaurantId;

    try {
        const category = await Category.findOne({where: {id, restaurantId}});
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        category.name = name || category.name;
        await category.save();
        res.status(200).json(category);
    } catch (error) {
        next(error);
    }
};