import express from "express";
import { createChannel, createChannelMessage, getChannelMessages, setUserTyping } from "./controllers/channelController.js";
import { addUserToServer, createServer, getServer, getServers, getServerUsers } from "./controllers/serverController.js";
import { createUser, loginUser, logoutUser } from "./controllers/userController.js";
const router = express.Router();

router.post('/users', createUser)
router.put('/users/login', loginUser)
router.put('/users/logout', logoutUser)
router.post('/servers', createServer)
router.get('/servers', getServers)
router.get('/servers/:serverId', getServer)
router.get('/servers/:serverId/users', getServerUsers)
router.put('/servers/:serverId/users', addUserToServer)


router.post('/channels/:serverId', createChannel)
router.get('/channels/:channelId/messages', getChannelMessages)
router.post('/channels/:channelId/typing', setUserTyping)
router.post('/channels/:channelId/messages', createChannelMessage)


export default router;
