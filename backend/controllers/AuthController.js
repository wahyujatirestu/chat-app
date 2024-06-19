const argon2 = require('argon2');
const { User } = require('../models/index.js');
const jwt = require('jsonwebtoken');

exports.getMe = async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (
            !authorizationHeader ||
            !authorizationHeader.startsWith('Bearer ')
        ) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.id;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const { id, fullname, username, email } = user;
        res.status(200).json({ id, fullname, username, email });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { username, email, password } = req.body;

    if ((!username && !email) || (username && email)) {
        return res
            .status(400)
            .json({ msg: 'Either username or email is required, not both' });
    }

    if (!password) {
        return res.status(400).json({ msg: 'Password is required' });
    }

    try {
        let user;

        if (email) {
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            if (isEmail) {
                user = await User.findOne({ where: { email } });
            } else {
                return res.status(400).json({ msg: 'Invalid email format' });
            }
        } else {
            user = await User.findOne({ where: { username } });
        }

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) {
            return res.status(400).json({ msg: 'Invalid password' });
        }

        const createToken = (id, email, username, expiresIn) => {
            const jwtSecretKey = process.env.JWT_SECRET_KEY;
            return jwt.sign({ id, email, username }, jwtSecretKey, {
                expiresIn,
            });
        };

        const accessToken = createToken(
            user.id,
            user.email,
            user.username,
            '1d'
        );
        // const refreshToken = createToken(
        //     user.id,
        //     user.email,
        //     user.username,
        //     '3d'
        // );
        // await user.update({ refreshToken });

        // res.cookie('refreshToken', refreshToken, {
        //     // Perbaiki di sini
        //     httpOnly: true,
        //     maxAge: 3 * 24 * 60 * 60 * 1000,
        // });

        const { id, fullname, username: userUsername, email: userEmail } = user;
        res.status(200).json({
            id,
            fullname,
            username: userUsername,
            email: userEmail,
            token: accessToken,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        res.cookie(jwt, '', { maxAge: 0 });
        res.status(200).json({ msg: 'Logout success' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
