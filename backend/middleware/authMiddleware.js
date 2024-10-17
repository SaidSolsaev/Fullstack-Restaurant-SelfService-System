import jwt from 'jsonwebtoken';

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

    if (!deviceKey || deviceKey !== process.env.DEVICE_SECRET_KEY) {
        return res.status(403).json({error: 'Unathorized device'});
    }

    next()
};