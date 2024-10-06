import Restaurant from "../models/restaurant.js";


export const getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.findAll();
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch restaurants' });
    }
};

export const getRestaurantById = async (req, res) => {
    const { id } = req.params;

    try {
        const restaurant = await Restaurant.findByPk(id);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }
        res.status(200).json(restaurant);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching restaurant' });
    }
};

export const createRestaurant = async (req, res) => {
    const { name, address, phone_number } = req.body;

    try {
        const newRestaurant = await Restaurant.create({
            name,
            address,
            phone_number
        });
        res.status(201).json(newRestaurant);
    } catch (error) {
        res.status(500).json({ error: 'Error creating restaurant' });
    }
};

export const deleteRestaurant = async (req, res) => {
    const { id } = req.params;

    try {
        const restaurant = await Restaurant.findByPk(id);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        await restaurant.destroy();
        res.status(200).json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting restaurant' });
    }
};

export const updateRestaurant = async (req, res) => {
    const { id } = req.params;
    const { name, address, phone_number } = req.body;

    try {
        const restaurant = await Restaurant.findByPk(id);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        restaurant.name = name || restaurant.name;
        restaurant.address = address || restaurant.address;
        restaurant.phone_number = phone_number || restaurant.phone_number;

        await restaurant.save();
        res.status(200).json(restaurant);
    } catch (error) {
        res.status(500).json({ error: 'Error updating restaurant' });
    }
};