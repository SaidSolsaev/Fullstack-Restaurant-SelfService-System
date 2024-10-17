import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Restaurant from './restaurant.js';

const Device = sequelize.define('Device', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    deviceKey: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    restaurantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Restaurants',
            key: 'id',
        },
    },
    deviceName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lastSeen: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    timestamps: true,
});

Device.belongsTo(Restaurant, { foreignKey: 'restaurantId' });

export default Device;
