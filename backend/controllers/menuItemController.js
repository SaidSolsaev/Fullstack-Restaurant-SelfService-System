import MenuItem from '../models/menuItem.js';
import Menu from '../models/menu.js';
import Category from '../models/category.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const getAllMenuItems = async(req, res, next) => {
    try {
        const { category } = req.query;
        let whereCondition = {};

        if (category) {
            whereCondition = {
                '$Category.name$': category
            };
        }

        const items = await MenuItem.findAll({
            include: [
                {
                    model: Category,
                    attributes: ['name']
                }
            ],
            where: whereCondition,
        });
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(items);
    } catch (error) {
        next(error)
    }
}

export const getMenuItemById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const menuItem = await MenuItem.findByPk(id);
        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.status(200).json(menuItem);
    } catch (error) {
        next(error)
    }
};

export const createMenuItem = async (req, res, next) => {
    const { name, description, price, menuId, categoryId, discount } = req.body;

    try {
        const menu = await Menu.findByPk(menuId);
        if (!menu) {
            return res.status(404).json({ error: 'Menu not found' });
        }

        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const image_url = req.file ? `/uploads/${req.file.filename}`: null;

        const newMenuItem = await MenuItem.create({
            name,
            description,
            price,
            image_url,
            discount,
            menuId,
            categoryId
        });

        res.status(201).json(newMenuItem);
    } catch (error) {
        next(error)
    }
};

export const updateMenuItem = async (req, res, next) => {
    const { id } = req.params; 
    const { name, description, price, categoryId, discount } = req.body;
    
    try {
        const menuItem = await MenuItem.findByPk(id);
        if (!menuItem) {
            return res.status(404).json({ error: 'MenuItem not found' });
        }

        
        if (categoryId) {
            const category = await Category.findByPk(categoryId);
            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }
        }

        let image_url = menuItem.image_url;

        
        if (req.file) {
            if (menuItem.image_url) {
                const oldImagePath = path.join(__dirname, '..', menuItem.image_url);
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error('Error deleting old image:', err);
                    }
                });
            }

            image_url = `/uploads/${req.file.filename}`;
        }
        
        menuItem.name = name || menuItem.name;
        menuItem.description = description || menuItem.description;
        menuItem.price = price || menuItem.price;
        menuItem.categoryId = categoryId || menuItem.categoryId;
        menuItem.discount = discount || menuItem.discount;
        menuItem.image_url = image_url;

        await menuItem.save();
        res.status(200).json(menuItem);
    } catch (error) {
        next(error);
    }
};


export const deleteMenuItem = async (req, res, next) => {
    const { id } = req.params; 

    try {
        const menuItem = await MenuItem.findByPk(id);
        if (!menuItem) {
            return res.status(404).json({ error: 'MenuItem not found' });
        }

        if (menuItem.image_url) {
            const imagePath = path.join(__dirname, '..', menuItem.image_url);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting image:', err);
                }
            });
        }

        await menuItem.destroy();
        res.status(200).json({ message: 'MenuItem deleted successfully' });
    } catch (error) {
        next(error)
    }
};
