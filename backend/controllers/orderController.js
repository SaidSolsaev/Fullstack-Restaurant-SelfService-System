import Order from '../models/order.js';
import MenuItem from '../models/menuItem.js';
import { OrderItems } from '../models/order.js';
import { generateOrderNumber } from '../utils/helpers.js';

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: MenuItem,
                    through: { attributes: ['quantity'] },
                    as: 'menuItems'
                }
            ]
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching orders' });
    }
};

export const getOrderByOrderNumber = async (req, res) => {
    const { orderNumber } = req.params;

    try {
        const order = await Order.findOne({
            where: { orderNumber },
            include: [
                {
                    model: MenuItem,
                    attributes: ['id', 'name'],
                    through: {
                        attributes: ['quantity'],
                    },
                    as: 'menuItems',
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
            orderedItems: order.menuItems.map(menuItem => ({
                itemId: menuItem.id,
                itemName: menuItem.name,
                quantity: menuItem.OrderItems.quantity
            }))
        };

        res.status(200).json(formattedOrder);
    } catch (error) {
        console.error('Error fetching order by order number:', error);
        res.status(500).json({ error: 'Error fetching order' });
    }
}

export const getOrderById = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findByPk(id, {
            include: [
                {
                    model: MenuItem,
                    through: { attributes: ['quantity']},
                    as: 'menuItems'
                }
            ]
        });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching order' });
    }
};

export const createOrder = async (req, res) => {
    const { items, phoneNumber, restaurantId, totalAmount } = req.body;

    try {
        const orderNumber = generateOrderNumber();

        const newOrder = await Order.create({
            totalAmount,
            status: 'pending',
            orderNumber,
            phoneNumber,
            estimatedTime: '30 min',
            restaurantId
        });

        
        for (const item of items) {
            await OrderItems.create({
                orderId: newOrder.id,
                menuItemId: item.menuItemId,
                quantity: item.quantity,
            });
        }

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ error: 'Error creating order', details: error.message });
        console.log(error);
    }
};


export const updateOrder = async (req, res) => {
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
        res.status(500).json({ error: 'Error updating order' });
    }
};

export const deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        await order.destroy();
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting order' });
    }
};
