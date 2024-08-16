/*import express from 'express';

import {
    addMessage
} from './../controllers/messages.controller.js';

import {verifyToken} from './../middleware/verifyToken.js';

const router = express.Router();

router.post('/:id',verifyToken,addMessage);

export default router;*/

import express from "express";
import {
  addMessage
} from "../controllers/messages.controller.js";
import {verifyToken} from "../middleware/verifyToken.js";

const router = express.Router();


router.post("/:chatId", verifyToken, addMessage);

export default router;
