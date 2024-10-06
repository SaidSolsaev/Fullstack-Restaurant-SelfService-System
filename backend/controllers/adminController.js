import Admin from '../models/admin.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";


export const createAdmin = async (req, res) => {
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
        res.status(500).json({ error: 'Error creating admin' });
    }
};

export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ where: { email } });

        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ id: admin.id, email: admin.email, restaurantId: admin.restaurantId }, process.env.JWT_SECRET, {
            expiresIn: '72h',
        });

        
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 72 * 60 * 60 * 1000  // Cookie varer i 72 timer
        });

        res.status(200).json({ message: 'Logged in successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
};


export const logoutAdmin = (req, res) => {
    res.clearCookie('jwt');
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
        res.status(500).json({ error: 'Error updating admin' });
    }
};

export const deleteAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        const admin = await Admin.findByPk(id);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        await admin.destroy();
        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting admin' });
    }
};