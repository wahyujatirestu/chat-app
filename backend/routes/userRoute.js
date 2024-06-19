const express = require('express');
const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} = require('../controllers/UserController.js');
// const { verifyUser } = require('../middleware/authUser.js');

const router = express.Router();

router.get('/user', getUsers);
router.get('/user/:id', getUserById);
router.post('/user', createUser);
router.patch('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);

module.exports = router;
