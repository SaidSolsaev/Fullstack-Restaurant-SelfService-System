
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Menu from './menu.js';
import Category from './category.js';

const MenuItem = sequelize.define('MenuItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    discount: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
    },
}, {
    timestamps: true,
});

// Knytt MenuItem til Menu og Category
MenuItem.belongsTo(Menu, { foreignKey: 'menuId' });
Menu.hasMany(MenuItem, { foreignKey: 'menuId' });

MenuItem.belongsTo(Category, { foreignKey: 'categoryId' });
Category.hasMany(MenuItem, { foreignKey: 'categoryId' });

export default MenuItem;
