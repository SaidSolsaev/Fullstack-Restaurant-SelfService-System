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
import paymentRouter from './routes/paymentRoute.js';
import deviceRoutes from "./routes/deviceRoutes.js";
import errorHandler from "./utils/errorHandler.js";

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
app.use('/api/payment', paymentRouter);
app.use('/api', deviceRoutes)
app.use(errorHandler);

const PORT = 3000;

sequelize.sync({ alter: true})
    .then(() => {
        console.log("DB synched");
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => {
        console.error("Error synching DB", error);
    })