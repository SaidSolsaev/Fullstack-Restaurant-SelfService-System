import express from "express";
import restaurantRoutes from './routes/restaurantRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import menuItemRoutes from './routes/menuItemRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import sequelize from "./config/db.js";
import dotenv from "dotenv";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//Routes
app.use('/api', restaurantRoutes);
app.use('/api', menuRoutes);
app.use('/api', menuItemRoutes);
app.use('/api', categoryRoutes);
app.use('/api', orderRoutes);
app.use('/api', adminRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = 3000;

sequelize.sync({force: false})
    .then(() => {
        console.log("DB synched");
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => {
        console.log("Error synching DB", error);
    })