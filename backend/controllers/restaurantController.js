import Restaurant from "../models/restaurant.js";


export const getRestaurants = async (req, res, next) => {
    const restaurantId = req.user.restaurantId;

    try {
        const restaurants = await Restaurant.findAll({where: {id: restaurantId}});
        res.json(restaurants);
    } catch (error) {
        next(error)
    }
};

export const getRestaurantById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const restaurant = await Restaurant.findByPk(id);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }
        res.status(200).json(restaurant);
    } catch (error) {
        next(error)
    }
};

export const getAdminRestaurant = async (req, res, next) => {
    
    try {
        const restaurantId = req.user.restaurantId
        
        if (!restaurantId) {
            return res.status(400).json({ message: 'Invalid restaurant ID' });
        }

        const restaurant = await Restaurant.findOne({
            where: {id: restaurantId}
        });

        if (!restaurant){
            return res.status(404).json({message: `Restaurant with id ${restaurantId}, not found`})
        }

        return res.status(200).json(restaurant)
    } catch (error) {
        next(error);
    }
}

export const createRestaurant = async (req, res, next) => {
    const { name, adress, phone_number } = req.body;

    try {
        const newRestaurant = await Restaurant.create({
            name,
            address: adress,
            phone_number
        });
        res.status(201).json(newRestaurant);
    } catch (error) {
        next(error)
    }
};

export const deleteRestaurant = async (req, res, next) => {
    const { id } = req.params;

    try {
        const restaurant = await Restaurant.findByPk(id);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        await restaurant.destroy();
        res.status(200).json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        next(error)
    }
};

export const updateRestaurant = async (req, res, next) => {
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
        next(error)
    }
};