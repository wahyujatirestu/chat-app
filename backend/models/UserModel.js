'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                required: true,
                validate: {
                    notEmpty: true,
                    isEmail: true,
                },
            },
            fullname: {
                type: DataTypes.STRING,
                allowNull: false,
                required: true,
                validate: {
                    notEmpty: true,
                },
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                required: true,
                validate: {
                    notEmpty: true,
                    len: [3, 20],
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                required: true,
                validate: {
                    notEmpty: true,
                },
            },
            gender: {
                type: DataTypes.ENUM('Male', 'Female'),
                allowNull: false,
                required: true,
                defaultValue: 'Male',
            },
            profilePic: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null,
            },
        },
        {
            tableName: 'users', // Opsi ini bisa digunakan jika Anda ingin menyesuaikan nama tabel
        }
    );

    return User;
};
