import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Restaurant from './restaurant.js';

const Menu = sequelize.define('Menu', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
}, {
    timestamps: true,
});

// En restaurant kan ha én meny
Menu.belongsTo(Restaurant, { foreignKey: 'restaurantId' });
Restaurant.hasOne(Menu, { foreignKey: 'restaurantId' });

export default Menu;
