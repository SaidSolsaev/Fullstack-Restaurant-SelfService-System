import Device from "../models/device.js";
import jwt from "jsonwebtoken";

//For Admin
export const createDevice = async (req, res, next) => {
    const { deviceKey, restaurantId, deviceName } = req.body;
    
    try {
        const newDevice = await Device.create({ deviceKey, restaurantId, deviceName });
        res.status(201).json(newDevice);
    } catch (error) {
        next(error);
    }
};


export const getDeviceById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const device = await Device.findByPk(id);
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }
        res.status(200).json(device);
    } catch (error) {
        next(error);
    }
};


export const updateDevice = async (req, res, next) => {
    const { id } = req.params;
    const { deviceKey, deviceName, restaurantId } = req.body;
    try {
        const device = await Device.findByPk(id);
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }
        device.deviceKey = deviceKey || device.deviceKey;
        device.deviceName = deviceName || device.deviceName;
        device.restaurantId = restaurantId || device.restaurantId;

        await device.save();
        res.status(200).json(device);
    } catch (error) {
        next(error);
    }
};


export const deleteDevice = async (req, res, next) => {
    const { id } = req.params;
    try {
        const device = await Device.findByPk(id);
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }
        await device.destroy();
        res.status(200).json({ message: 'Device deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export const getAllDevices = async (req, res, next) => {
    try {
        const devices = await Device.findAll();
        res.status(200).json(devices);
    } catch (error) {
        next(error);
    }
};

export const deviceLogin = async (req, res, next) => {
    const {deviceName, deviceKey} = req.body;

    try {
        const device = await Device.findOne({where: {deviceName: deviceName, deviceKey: deviceKey}});

        if (!device){
            return res.status(403).json({message: "Invalid Credentials"});
        }

        const token = jwt.sign(
            {deviceId: device.id, restaurantId: device.restaurantId},
            process.env.JWT_SECRET,
            {expiresIn: '15d'}
        );

        res.status(200).json({token});
    } catch (error) {
        next(error)
    }
}

export const refreshToken = async(req, res, next) => {
    const {deviceId, restaurantId} = req.user;

    const newToken = jwt.sign(
        {deviceId, restaurantId},
        process.env.JWT_SECRET,
        {expiresIn: '30d'}
    );
    
    res.status(200).json({ token: newToken });
}


