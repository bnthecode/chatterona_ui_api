import express from "express";
import { addChannelToCategory } from "./controllers/categoryController.js";
import {
  createChannel,
  createChannelMessage,
  createDirectMessage,
  getChannelMessages,
  getDirectMessages,
} from "./controllers/channelController.js";
import {
  addUserToServer,
  createServer,
  getPublicServers,
  getServer,
  getServerCategories,
  getServers,
  getServerUsers,
} from "./controllers/serverController.js";
import {
  createUser,
  getUserFriends,
  loginUser,
  logoutUser,
  subscribeToNotifications,
} from "./controllers/userController.js";
const router = express.Router();

// users
router.post("/users", createUser);
router.put("/users/login", loginUser);
router.put("/users/logout", logoutUser);
router.get("/users/friends", getUserFriends);

// notifications
router.post("/subscribe", subscribeToNotifications);

// servers
router.post("/servers", createServer);
router.get("/servers", getServers);
router.get("/servers/public", getPublicServers)
router.get("/servers/:serverId", getServer);
router.get("/servers/:serverId/users", getServerUsers);
router.put("/servers/:serverId/users", addUserToServer);
router.get("/servers/:serverId/categories", getServerCategories);


router.put("/categories/:categoryId/channels", addChannelToCategory)

// channels / messages
router.post("/channels", createDirectMessage);
router.post("/channels/:serverId", createChannel);
router.get("/channels/:channelId/messages", getChannelMessages);
router.get("/channels/direct-messages", getDirectMessages);
router.post("/channels/:channelId/messages", createChannelMessage);

export default router;
