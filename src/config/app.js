import express from 'express';
import userRouter from '../api/users/user.routes';

const router = express.Router();
router.use(userRouter);

export default router;
