import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUserData, updateUserProfile, deleteUser } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);

userRouter.put('/update', userAuth, updateUserProfile);

userRouter.delete('/delete', userAuth, deleteUser);

export default userRouter;