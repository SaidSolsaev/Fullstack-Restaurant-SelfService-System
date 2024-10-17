import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Restaurant from './restaurant.js';

const Admin = sequelize.define('Admin', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    restaurantId: {
        type: DataTypes.INTEGER,
        references: { model: 'Restaurants', key: 'id' },
    }
}, {
    timestamps: true,
});


Admin.belongsTo(Restaurant, { foreignKey: 'restaurantId' });

export default Admin;
