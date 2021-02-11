import express from "express";
import { createChannel } from "./controllers/channelController.js";
import { createMessage } from "./controllers/messageController.js";
import { createServer } from "./controllers/serverController.js";
const router = express.Router();

router.post('/servers', createServer)
router.post('/servers/:serverId/channels', createChannel)
router.post('/servers/:serverId/channels/:channelId/messages', createMessage)


export default router;
