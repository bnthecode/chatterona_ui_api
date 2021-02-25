import moment from "moment";
import Channel from "../models/Channel.js";
import Server from "../models/Server.js";
import {
  mongoServersToUiServers,
  mongoServerToUiServer,
} from "../parsers/serverParsers.js";
import logger from "../utilities/logger.js";
import { mainServer, mainUser } from "../utilities/inital-data.js";

export const getServers = async (req, res) => {
  try {
    const { user } = req;
    const foundServers = await Server.find({ users: user.id });
    const uiServers = foundServers.map((home) => mongoServersToUiServers(home));
    res.status(200).send(uiServers);
  } catch (err) {
    logger.error(`GET /servers ${err.message}`);
    res.status(500).send("error occured getting servers");
  }
};

export const getServer = async (req, res) => {
  try {
    const { serverId } = req.params;
    const foundServer = await Server.findById(serverId);
    const uiServer = mongoServerToUiServer(foundServer);
    res.status(200).send(uiServer);
  } catch (err) {
    logger.error(`GET /servers/id ${err.message}`);
    res.status(500).send("error occured getting server");
  }
};

export const getServerUsers = async (req, res) => {
  try {
    const { serverId } = req.params;
    const foundServer = await Server.findOne({ _id: serverId }).populate(
      "users"
    );
    res.status(200).send(foundServer.users);
  } catch (err) {
    logger.error(`GET /servers/id/users ${err.message}`);
    res.status(500).send("error occured getting server");
  }
};

export const addUserToServer = async (req, res) => {
  try {
    const { serverId } = req.params;
    const { userId } = req.body;

    const foundServer = await Server.findById(serverId);
    // instead just send a message, and when they accept you can then you add.. but for now this works fine
    foundServer.users.push(userId);
    await foundServer.save();

    res.status(200).send("updated");
  } catch (err) {
    logger.error(`PUT /servers/id/users ${err.message}`);
    res.status(500).send("error occured adding users to server");
  }
};
export const createServer = async (req, res) => {
  try {
    const { user } = req;
    const { server } = req.body;
    const channels = [
      { name: "general-1", type: "text", messages: [] },
      { name: "general-2", type: "voice", messages: [] },
    ];
    const savedChannels = Promise.all(
      channels.map(async (chnl) => {
        const channel = new Channel({
          ...chnl,
        });

        const savedChannel = await channel.save();
        return {
          name: savedChannel.name,
          type: savedChannel.type,
          _id: savedChannel._id,
        };
      })
    );

    const newServer = new Server({
      name: server.name || mainServer.name,
      photoURL: user.photoURL || mainUser.photoURL,
      timestamp: moment(),
      updates: [],
      channels: await savedChannels,
      users: [req.user.id],
    });

    const createdServer = await newServer.save();
    const uiServer = mongoServerToUiServer(createdServer);
    res.status(201).send(uiServer);
  } catch (err) {
    logger.error(`POST /servers ${err.message}`);
    res.status(500).send("error occured creating server");
  }
};
