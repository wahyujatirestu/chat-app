const { User } = require('../models/index.js');
const jwt = require('jsonwebtoken');

exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401);

        const user = await User.findOne({
            where: {
                refreshToken: refreshToken,
            },
        });

        if (!user) return res.sendStatus(403);
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err) return res.sendStatus(403);
                const userId = user.id;
                const name = user.name;
                const email = user.email;
                const accessToken = jwt.sign(
                    { userId, name, email },
                    process.env.ACCESS_TOKEN_SECRET,
                    {
                        expiresIn: '15s',
                    }
                );
                res.json({ accessToken });
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
