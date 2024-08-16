/*import express from 'express';

import {
    getChats,
    getChat,
    addChat,
    readChat
} from './../controllers/chat.controller.js';

import {verifyToken} from './../middleware/verifyToken.js';

const router = express.Router();

router.get('/',verifyToken,getChats);
router.get('/:id',verifyToken,getChat);
router.post('/',verifyToken,addChat);
router.put('/read/:id',verifyToken,readChat);

export default router;*/

import express from "express";
import {
  getChats,
  getChat,
  addChat,
  readChat,
  isChat
} from "../controllers/chat.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getChats);
router.get("/:id", verifyToken, getChat);
router.get("/find/:id",verifyToken,isChat);
router.post("/", verifyToken, addChat);
router.put("/read/:id", verifyToken, readChat);

export default router;
