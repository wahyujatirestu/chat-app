const { User } = require('../models/index.js');
const jwt = require('jsonwebtoken');

exports.verifyUser = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ msg: 'Unauthorized: No token provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ msg: 'Unauthorized: Malformed token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = await User.findOne({ where: { id: decoded.id } });

        if (!req.user) {
            return res
                .status(401)
                .json({ msg: 'Unauthorized: User not found' });
        }
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Unauthorized: Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res
                .status(401)
                .json({ msg: 'Unauthorized: Token has expired' });
        }
        res.status(500).json({ error: error.message });
    }
};
