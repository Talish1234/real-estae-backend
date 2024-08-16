import express from 'express';
import {verifyToken} from './../middleware/verifyToken.js';
import { getUsers,getUser,updateUser,deleteUser,savePost,profilePosts,getNotification} from '../controllers/user.controller.js';
const router = express.Router();

router.get('/',getUsers);
router.get('/:id',verifyToken,getUser);
router.put('/:id',verifyToken,updateUser);
router.delete('/:id',verifyToken,deleteUser);
router.post('/save',verifyToken,savePost);
router.get('/profile/post',verifyToken,profilePosts);
router.get('/notification',verifyToken,getNotification);
export default router;