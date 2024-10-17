import Menu from '../models/menu.js';
import Restaurant from '../models/restaurant.js';

export const getAllMenus = async (req, res, next) => {
    try {
        const menus = await Menu.findAll();
        res.status(200).json(menus);
    } catch (error) {
        next(error);
    }
};

export const getMenuById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const menu = await Menu.findByPk(id);
        if (!menu) {
            return res.status(404).json({ error: 'Menu not found' });
        }
        res.status(200).json(menu);
    } catch (error) {
        next(error)
    }
};


export const createMenu = async (req, res, next) => {
    const { restaurantId } = req.body;

    try {
        const restaurant = await Restaurant.findByPk(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        const newMenu = await Menu.create({
            restaurantId
        });
        res.status(201).json(newMenu);
    } catch (error) {
        next(error)
    }
};

export const getMenu = async(req, res, next) => {
    try {
        const menu = await Menu.findAll();
        res.json(menu)
    } catch (error) {
        next(error)
    }
}

export const deleteMenu = async(req, res, next) => {
    const { id } = req.params;
    
    try {
        const menu = Menu.findByPk()

        if (!menu) {
            return res.status(404).json({ error: 'Menu not found' });
        }

        await menu.destroy();
        res.status(200).json({ message: 'Menu deleted successfully' });
    } catch (error) {
        next(error)
    }
}