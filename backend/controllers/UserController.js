const argon2 = require('argon2');
const { User } = require('../models/index.js');
const { Op } = require('sequelize');
const validator = require('validator');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'fullname', 'username', 'email', 'gender'],
        });

        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findOne({
            attributes: ['id', 'email', 'fullname', 'username', 'gender'],
            where: { id: req.params.id },
        });

        if (!user) {
            return res.status(404).json({ msg: 'User tidak ditemukan' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createUser = async (req, res) => {
    const { email, fullname, username, password, confPassword, gender } =
        req.body;

    if (password !== confPassword) {
        return res
            .status(400)
            .json({ msg: 'Password dan konfirmasi password tidak sama.' });
    }

    if (password.length < 8 || password.length > 20) {
        return res
            .status(400)
            .json({ msg: 'Panjang password harus antara 8-20 karakter.' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ msg: 'Email tidak valid.' });
    }

    if (!validator.isAlphanumeric(username)) {
        return res.status(400).json({
            msg: 'Username hanya boleh berisi huruf dan angka.',
        });
    }

    if (
        !validator.isStrongPassword(password, {
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
    ) {
        return res.status(400).json({ msg: 'Password tidak valid.' });
    }

    try {
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email: email }, { username: username }],
            },
        });

        if (existingUser) {
            if (existingUser.username === username) {
                return res
                    .status(400)
                    .json({ msg: 'Username sudah digunakan.' });
            }
            if (existingUser.email === email) {
                return res.status(400).json({ msg: 'Email sudah digunakan.' });
            }
        }

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const hashPassword = await argon2.hash(password);
        await User.create({
            email,
            fullname,
            username,
            password: hashPassword,
            gender,
            profilePic: gender === 'Male' ? boyProfilePic : girlProfilePic,
        });

        res.status(201).json({ msg: 'User created successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    const user = await User.findOne({
        where: { id: req.params.id },
    });
    if (!user) return res.status(404).json({ msg: 'User tidak ditemukan' });
    const { email, fullname, username, password, confPassword, gender } =
        req.body;
    let hashPassword;
    if (password === '' || password === null) {
        hashPassword = user.password;
    } else {
        hashPassword = await argon2.hash(password);
    }

    if (password !== confPassword) {
        return res
            .status(400)
            .json({ msg: 'Password dan Konfirmasi password tidak sama' });
    }

    try {
        await User.update(
            {
                email,
                fullname,
                username,
                password: hashPassword,
                gender,
            },
            {
                where: { id: req.params.id },
            }
        );
        res.status(200).json({ msg: 'User Updated' });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    const user = await User.findOne({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ msg: 'User not found.' });
    try {
        await User.destroy({ where: { id: req.params.id } });
        res.status(200).json({ msg: 'User deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
