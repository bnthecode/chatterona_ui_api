import Channel from "../models/channelModel.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import {
  addToPreviousMessage,
  decideOnUpdate,
  getLastMessage,
  getMinutesPassed,
  getPreviousTime,
  structureNewMessage,
} from "../utilities/message-utilities.js";
import moment from "moment";
import logger from "../utilities/logger.js";
import serverModel from "../models/serverModel.js";
import {
  mongoChannelToUiChannel,
  } from "../parsers/channelParsers.js";

export const createChannel = async (req, res) => {
  try {
    const { serverId } = req.params;
    const { channel } = req.body;

    const createdChannel = new Channel({
      ...channel,
    });

    const foundServer = await serverModel.findById(serverId);
    const savedChannel = await createdChannel.save();

    foundServer.channels.push({
      _id: savedChannel._id,
      name: channel.name,
      type: channel.type,
    });
    await foundServer.save();
    const uiChannel = mongoChannelToUiChannel(savedChannel);
    res.status(201).send(uiChannel);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const createDirectMessage = async (req, res) => {
  try {
    const { channel } = req.body;
    const { user } = req;

    const createdChannel = new Channel({
      ...channel,
    });
    await createdChannel.save();
    const foundUser = await User.findById(user.id);
    const otherUser = await User.findById(channel.to);

    const newDM = {
      to: {
        userId: otherUser._id,
        photoURL: otherUser.photoURL,
        username: otherUser.username,
      },
      from: {
        userId: foundUser._id,
        photoURL: foundUser.photoURL,
        username: foundUser.username,
      },
      channelId: createdChannel._id,
    };
    foundUser.directMessages.push(newDM);

    otherUser.directMessages.push(newDM);

    await otherUser.save();

    await foundUser.save();
    res.status(201).send(newDM);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const getDirectMessages = async (req, res) => {
  try {
    const { user } = req;

    const foundUser = await User.findById(user.id);
    const messages = foundUser ? foundUser.directMessages : [];

    res.status(200).send(messages);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const getChannelMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const foundChannel = await Channel.findById(channelId).populate({
      path: "messages",
      options: {
        sort: { timestamp: "asc" },
      },
    });

    res.status(201).send(foundChannel.messages);
  } catch (err) {
    logger.error(
      `GET /channels/messages ${err.message}, ${req.params.channelId}`
    );
    res.status(500).send({ message: err.message });
  }
};

export const createChannelMessage = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { user } = req;
    const { message } = req.body;
    
    let responseMessage = {};

    const newMessageContent = await structureNewMessage(message);
    const foundChannel = await Channel.findOne({ _id: channelId }).populate({
      path: "messages",
    });

    const lastMessage = getLastMessage(foundChannel.messages);
    const previousTime = getPreviousTime(lastMessage);
    const minutesPassed = getMinutesPassed(previousTime);
    const updateLast = decideOnUpdate(
      minutesPassed,
      lastMessage,
      user.username
    );

    if (updateLast) {
      const updatedMessage = addToPreviousMessage(
        foundChannel.messages,
        newMessageContent
      );

      await Message.findByIdAndUpdate(lastMessage._id, { ...updatedMessage });

      await foundChannel.save();
      responseMessage = updatedMessage;
    } else {
      const newDbMessage = new Message({
        author: user,
        content: [newMessageContent],
        date: moment(),
        idx: foundChannel.messages.length,
      });
      const savedMessage = await newDbMessage.save();
      responseMessage = savedMessage;
      foundChannel.messages.push(savedMessage._id);
      await foundChannel.save();
    }

    res.status(201).send({ message: responseMessage, merge: updateLast });
  } catch (err) {
    logger.error(`POST /channels ${err.message}`);
    res.status(500).send({ message: err.message });
  }
};
