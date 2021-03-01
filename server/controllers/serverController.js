import moment from "moment";
import Channel from "../models/Channel.js";
import Server from "../models/Server.js";
import {
  mongoServersToUiServers,
  mongoServerToUiServer,
} from "../parsers/serverParsers.js";
import logger from "../utilities/logger.js";
import { mainServer, mainUser } from "../utilities/inital-data.js";
import Category from "../models/Category.js";

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
    const foundServer = await Server.findById(serverId).populate('categories');
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
    console.log(userId)
    const foundServer = await Server.findById(serverId);
    console.log(foundServer)
    // instead just send a message, and when they accept you can then you add.. but for now this works fine
    foundServer.users.push(userId);
    await foundServer.save();

    res.status(200).send("updated");
  } catch (err) {
    logger.error(`PUT /servers/id/users ${err.message}`);
    res.status(500).send("error occured adding users to server");
  }
};

export const getServerCategories = async (req, res) => {
  try {
    const { serverId } = req.params;

    const foundServer = await Server.findById(serverId).populate("categories");
    res.status(200).send(foundServer.categories);
  } catch (err) {
    logger.error(`PUT /servers/id/categories ${err.message}`);
    res.status(500).send("error occured adding users to server");
  }
};

export const getPublicServers = async (req, res) => {
  try {
    console.log("im herer....");
    const foundServers = await Server.find({ type: "public" });
    res.status(200).send(foundServers);
  } catch (err) {
    logger.error(`PUT /servers/public ${err.message}`);
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

    const textChannel = new Channel({
      name: "general",
      type: "text",
      messages: [],
    });
    const voiceChannel = new Channel({
      name: "general",
      type: "voice",
      messages: [],
    });

    const textChannel2 = new Channel({
      name: "calling all goats",
      type: "text",
      messages: [],
    });
    const textChannel3 = new Channel({
      name: "chatterona bugs",
      type: "text",
      messages: [],
    });
    const textChannel4 = new Channel({
      name: "chatterona questions",
      type: "text",
      messages: [],
    });
    const textChannel5 = new Channel({
      name: "chatterona concerns",
      type: "text",
      messages: [],
    });

    const savedTextChannel = await textChannel.save();
    const savedVoiceChannel = await voiceChannel.save();
    const savedTextChannel2 = await textChannel2.save();
    const savedTextChannel3 = await textChannel3.save();
    const savedTextChannel4 = await textChannel4.save();
    const savedTextChannel5 = await textChannel5.save();


    const categories = [
      {
        name: "text channels",
        channels: [
          {
            id: savedTextChannel._id,
            name: savedTextChannel.name,
            type: "text",
          },
      
        ],
      },
      {
        name: "voice channels",
        channels: [
          {
            id: savedVoiceChannel._id,
            name: savedVoiceChannel.name,
            type: "voice",
          },

        ],
      },
      {
        name: "only goats",
        channels: [
          {
            id: savedTextChannel2._id,
            name: savedTextChannel2.name,
            type: "text",
          },
        ],
      },
      {
        name: "chatterona issues",
        channels: [
          {
            id: savedTextChannel3._id,
            name: savedTextChannel3.name,
            type: "text",
          },
        ],
      },
      {
        name: "q & a",
        channels: [
          {
            id: savedTextChannel4._id,
            name: savedTextChannel4.name,
            type: "text",
          },
          {
            id: savedTextChannel5._id,
            name: savedTextChannel5.name,
            type: "text",
          },

        ],
      },
    ];
    const savedCategories = Promise.all(
      categories.map(async (cat) => {
        const category = new Category({
          name: cat.name,
          channels: cat.channels,
        });
        const savedCategory = await category.save();

        return {
          name: savedCategory.name,
          _id: savedCategory._id,
        };
      })
    );

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
      categories: await savedCategories,
      users: [req.user.id],
      type: server.type || "private",
      description:
        server.description ||
        "There was no description listed for this server. But most likely this is going to be Chatterona Public Server, since there are no other servers :)",
    });

    const createdServer = await newServer.save();
    const uiServer = mongoServerToUiServer(createdServer);
    res.status(201).send(uiServer);
  } catch (err) {
    logger.error(`POST /servers ${err.message}`);
    res.status(500).send("error occured creating server");
  }
};
