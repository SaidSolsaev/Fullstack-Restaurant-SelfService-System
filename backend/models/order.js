import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Restaurant from './restaurant.js';
import MenuItem from './menuItem.js';

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    orderNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    estimatedTime: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
});

// En order tilhører en restaurant
Order.belongsTo(Restaurant, { foreignKey: 'restaurantId' });

// Order kan ha flere MenuItems med mengde
const OrderItems = sequelize.define('OrderItems', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
});

Order.belongsToMany(MenuItem, { through: OrderItems, foreignKey: 'orderId' });
MenuItem.belongsToMany(Order, { through: OrderItems, foreignKey: 'menuItemId' });

export default Order;
export { OrderItems };
