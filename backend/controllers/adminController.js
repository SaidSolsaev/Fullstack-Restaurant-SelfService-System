import Admin from '../models/admin.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";


export const createAdmin = async (req, res, next) => {
    const { email, password, restaurantId } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await Admin.create({
            email,
            password: hashedPassword,
            restaurantId
        });

        res.status(201).json(newAdmin);
    } catch (error) {
        next(error);
    }
};

export const loginAdmin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ where: { email } });

        if (!admin) {
            return res.status(404).json({ error: 'User not found. Please Try Again!' });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password. Please Try Again' });
        }

        const token = jwt.sign({ 
            id: admin.id, 
            email: admin.email, 
            restaurantId: admin.restaurantId }, process.env.JWT_SECRET, {
            expiresIn: '72h',
        });


        res.status(200).json({ 
            message: 'Logged in successfully',
            access_token: token,
        });
    } catch (error) {
        next(error)
    }
};


export const logoutAdmin = (req, res, next) => {
    res.status(200).json({ message: 'Logged out successfully' });
};

export const updateAdmin = async (req, res) => {
    const { id } = req.params;
    const { email, password, restaurantId } = req.body;

    try {
        const admin = await Admin.findByPk(id);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        admin.email = email || admin.email;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            admin.password = hashedPassword;
        }
        admin.restaurantId = restaurantId || admin.restaurantId;

        await admin.save();
        res.status(200).json(admin);
    } catch (error) {
        next(error)
    }
};

export const deleteAdmin = async (req, res, next) => {
    const { id } = req.params;

    try {
        const admin = await Admin.findByPk(id);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        await admin.destroy();
        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
        next(error)
    }
};