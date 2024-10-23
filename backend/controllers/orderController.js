import Order from '../models/order.js';
import MenuItem from '../models/menuItem.js';
import { OrderItems } from '../models/order.js';
import { generateOrderItemNumber, generateOrderNumber } from '../utils/helpers.js';
import sequelize from '../config/db.js';
import Category from '../models/category.js';

export const getAllOrders = async (req, res, next) => {
    const restaurantId = req.user.restaurantId || req.headers['restaurant-id'];

    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: OrderItems,
                    as: 'orderItems',
                    include: [
                        {
                            model: MenuItem,
                            include: [
                                {
                                    model: Category,
                                    attributes: ['id' , 'name']
                                }
                            ],
                            attributes: ['id', 'name', 'price', 'image_url', ],
                        },
                    ],
                    attributes: ['quantity', 'addOns'],
                }
            ],
            where: {restaurantId}
        });

        res.status(200).json(orders);
    } catch (error) {
        next(error)
    }
};

export const getOrderByOrderNumber = async (req, res, next) => {
    const { orderNumber } = req.params;
    const restaurantId = req.user.restaurantId || req.headers['restaurant-id'];

    try {
        const order = await Order.findOne({
            where: { orderNumber, restaurantId },
            include: [
                {
                    model: OrderItems,
                    as: 'orderItems',
                    include: [
                        {
                            model: MenuItem,
                            attributes: ['id', 'name', 'image_url', 'price'],
                        },
                    ],
                    attributes: ['quantity', 'addOns'],
                }
            ],
            attributes: ['orderNumber', 'totalAmount', 'phoneNumber'],
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const formattedOrder = {
            orderNumber: order.orderNumber,
            totalAmount: order.totalAmount,
            phoneNumber: order.phoneNumber,
            orderedItems: order.orderItems.map(orderItem => ({
                itemId: orderItem.menuItem.id,
                itemName: orderItem.menuItem.name,
                itemImage: orderItem.menuItem.image_url,
                itemPrice: orderItem.menuItem.price,
                quantity: orderItem.quantity,
                addOns: orderItem.addOns
            }))
        };

        res.status(200).json(formattedOrder);
    } catch (error) {
        next(error)
    }
}

export const getOrderById = async (req, res, next) => {
    const restaurantId = req.user.restaurantId || req.headers['restaurant-id'];
    const {id} = req.params;

    try {
        const order = await Order.findOne({
            where: {id, restaurantId},
            include: [
                {
                    model: OrderItems,
                    as: 'orderItems',
                    include: [
                        {
                            model: MenuItem,
                            attributes: ['id', 'name', 'image_url', 'price'],
                        },
                    ],
                    attributes: ['quantity', 'addOns'],
                }
            ]
        });
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.status(200).json(order);
    } catch (error) {
        next(error)
    }
};

export const createOrder = async (req, res, next) => {
    const { items, phoneNumber, totalAmount } = req.body;
    const restaurantId = req.user.restaurantId || req.headers['restaurant-id'];
    
    const transaction = await sequelize.transaction();

    try {
        const orderNumber = generateOrderNumber();

        const newOrder = await Order.create({
            totalAmount,
            status: 'received',
            orderNumber,
            phoneNumber,
            estimatedTime: '30 min',
            restaurantId
        }, {transaction});

        for (const item of items) {
            const { menuItemId, quantity, addOns } = item;

            await OrderItems.create({
                orderId: newOrder.id,
                menuItemId: menuItemId,
                quantity: quantity,
                addOns: addOns
            }, {transaction});
        }

        await transaction.commit();

        const createdOrder = await Order.findOne({
            where: { id: newOrder.id },
            include: { model: OrderItems, as: 'orderItems' }
        });

        res.status(201).json(createdOrder);
    } catch (error) {
        next(error)
    }
};


export const updateOrder = async (req, res, next) => {
    const { id } = req.params;
    const { status, estimatedTime } = req.body;
    const restaurantId = req.user.restaurantId || req.headers['restaurant-id'];
    
    try {
        const order = await Order.findOne({where: {id, restaurantId} });
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        order.status = status || order.status;
        order.estimatedTime = estimatedTime || order.estimatedTime;

        await order.save();
        res.status(200).json(order);
    } catch (error) {
        next(error)
    }
};

export const deleteOrder = async (req, res, next) => {
    const { id } = req.params;
    const restaurantId = req.user.restaurantId || req.headers['restaurant-id'];
    
    try {
        const order = await Order.findOne({where: {id, restaurantId}});
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        await order.destroy();
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        next(error)
    }
};
