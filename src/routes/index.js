import {Router} from 'express';
import petRouter from './pets/pet.routes.js';
import authRouter from './auth/auth.routes.js';

const router= Router();

router.use('/pets',petRouter);
router.use('/auth',authRouter);

export default router;
