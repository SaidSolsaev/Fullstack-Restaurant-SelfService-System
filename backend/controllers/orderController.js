import Order from '../models/order.js';
import MenuItem from '../models/menuItem.js';
import { OrderItems } from '../models/order.js';
import { generateOrderItemNumber, generateOrderNumber } from '../utils/helpers.js';
import sequelize from '../config/db.js';

export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: OrderItems,
                    as: 'orderItems',
                    include: [
                        {
                            model: MenuItem,
                            attributes: ['id', 'name', 'price', 'image_url'],
                        },
                    ],
                    attributes: ['quantity', 'addOns'],
                }
            ],
        });

        res.status(200).json(orders);
    } catch (error) {
        next(error)
    }
};

export const getOrderByOrderNumber = async (req, res, next) => {
    const { orderNumber } = req.params;

    try {
        const order = await Order.findOne({
            where: { orderNumber },
            include: [
                {
                    model: OrderItems,
                    as: 'orderItems',
                    include: [
                        {
                            model: MenuItem,
                            attributes: ['id', 'name'],
                        },
                    ],
                    attributes: ['quantity', 'addOns'],
                }
            ],
            attributes: ['orderNumber', 'totalAmount'],
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const formattedOrder = {
            orderNumber: order.orderNumber,
            totalAmount: order.totalAmount,
            orderedItems: order.orderItems.map(orderItem => ({
                itemId: orderItem.menuItem.id,
                itemName: orderItem.menuItem.name,
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
    try {
        const order = await Order.findByPk(id, {
            include: [
                {
                    model: OrderItems,
                    as: 'orderItems',
                    include: [
                        {
                            model: MenuItem,
                            attributes: ['id', 'name'],
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
    const { items, phoneNumber, restaurantId, totalAmount } = req.body;

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

    try {
        const order = await Order.findByPk(id);
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

    try {
        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        await order.destroy();
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        next(error)
    }
};
