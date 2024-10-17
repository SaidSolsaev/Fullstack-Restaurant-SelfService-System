import jwt from 'jsonwebtoken';
import Device from '../models/device.js';

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;


    if (!authHeader) {
        return res.status(401).json({ error: 'Access denied, no token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};

export const verifyDeviceKey = (req, res, next) => {
    const deviceKey = req.headers['x-device-key'];
    const restaurantId = req.headers['x-restaurant-id'];

    if (!deviceKey || deviceKey !== process.env.DEVICE_SECRET_KEY) {
        return res.status(403).json({error: 'Unathorized device'});
    }

    req.user = req.user || {}
    req.user.restaurantId = restaurantId

    next()
};

export const validateDevice = async (req, res, next) => {
    const deviceKey = req.headers["x-device-key"]
    

    const device = await Device.findOne({where: { deviceKey: deviceKey }});

    if (!device){
        return res.status(403).json({ error: 'Invalid device' });
    }

    req.user = req.user || {}
    req.user.restaurantId = device.restaurantId;
    next();
}


export const authenticateDevice = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token.' });
    }
};

export const checkEitherAuth = (req, res, next) => {
    authMiddleware(req, res, (err) => {
        if (!err){
            return next();
        }

        authenticateDevice(req, res, (err2) => {
            if (!err2){
                return next()
            }

            return res.status(403).json({message: "Unathorized access"})
        })
    })
}