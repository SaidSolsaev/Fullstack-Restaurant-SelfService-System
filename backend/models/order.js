import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Restaurant from './restaurant.js';
import MenuItem from './menuItem.js';

const Order = sequelize.define('Orders', {
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
    restaurantId: {
        type: DataTypes.INTEGER,
        references: { model: 'Restaurants', key: 'id' },
    }
}, {
    timestamps: true,
});


Order.belongsTo(Restaurant, { foreignKey: 'restaurantId' });


const OrderItems = sequelize.define('OrderItems', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    addOns : {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: []
    }
}, {
    timestamps: false,
});

Order.hasMany(OrderItems, {
    foreignKey: 'orderId',
    as: 'orderItems',
});

OrderItems.belongsTo(Order, {
    foreignKey: 'orderId',
});

MenuItem.hasMany(OrderItems, {
    foreignKey: 'menuItemId',
    as: 'orderItems',
});

OrderItems.belongsTo(MenuItem, {
    foreignKey: 'menuItemId',
});

export default Order;
export { OrderItems };
