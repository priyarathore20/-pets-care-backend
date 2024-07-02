const express = require('express');
const petRouter = require('./pets/pet.routes');
const authRouter = require('./auth/auth.routes');
const userRouter = require('./user/user.routes');

const router = express.Router();

router.use('/user', userRouter);
router.use('/pets', petRouter);
router.use('/auth', authRouter);

module.exports = router;
