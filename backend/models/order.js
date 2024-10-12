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


Order.belongsTo(Restaurant, { foreignKey: 'restaurantId' });


const OrderItems = sequelize.define('OrderItems', {
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Orders',
            key: 'id'
        }
    },
    menuItemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'MenuItems',
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    addOns : {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    }
}, {
    timestamps: false,
});

Order.belongsToMany(MenuItem, { through: OrderItems, foreignKey: 'orderId', as: 'menuItems' });
MenuItem.belongsToMany(Order, { through: OrderItems, foreignKey: 'menuItemId' });

export default Order;
export { OrderItems };
