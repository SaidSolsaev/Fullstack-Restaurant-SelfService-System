import Order from '../models/order.js';
import MenuItem from '../models/menuItem.js';
import { OrderItems } from '../models/order.js';
import { formatPrice } from '../utils/helpers.js';


export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching orders' });
    }
};

export const getOrderById = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching order' });
    }
};

export const createOrder = async (req, res) => {
    const { items, phoneNumber, restaurantId } = req.body;

    try {
        
        let totalAmount = 0;
        for (const item of items) {
            const menuItem = await MenuItem.findByPk(item.menuItemId);
            if (!menuItem) {
                return res.status(404).json({ error: `MenuItem ${item.menuItemId} not found` });
            }
            totalAmount += menuItem.price * item.quantity;
        }

        const orderNumber = generateOrderNumber();

        totalAmount = formatPrice(totalAmount);

        const newOrder = await Order.create({
            totalAmount,
            status: 'pending',
            orderNumber,
            phoneNumber,
            estimatedTime: '30 min',
            restaurantId
        });

        // Legg til bestilte varer
        for (const item of items) {
            await OrderItems.create({
                orderId: newOrder.id,
                menuItemId: item.menuItemId,
                quantity: item.quantity,
            });
        }

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ error: 'Error creating order' });
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
