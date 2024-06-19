'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                required: true,
                validate: {
                    notEmpty: true,
                    isEmail: true,
                },
            },
            fullname: {
                type: Sequelize.STRING,
                allowNull: false,
                required: true,
                validate: {
                    notEmpty: true,
                },
            },
            username: {
                type: Sequelize.STRING,
                allowNull: false,
                required: true,
                unique: true,
                validate: {
                    notEmpty: true,
                },
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
                required: true,
                validate: {
                    notEmpty: true,
                },
            },
            gender: {
                type: Sequelize.ENUM('Male', 'Female'),
                allowNull: false,
                required: true,
                defaultValue: 'Male',
            },
            profilePic: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: null,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('users');
    },
};
