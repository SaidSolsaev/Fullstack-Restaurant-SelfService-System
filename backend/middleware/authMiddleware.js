import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({ error: 'Access denied, no token provided' });
    }

    try {
        // Verifiser token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Legger til decoded token (brukerdata) i request-objektet
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