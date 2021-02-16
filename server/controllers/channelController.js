import Channel from "../models/channelModel.js";
import Message from "../models/messageModel.js";
import { addToPreviousMessage, decideOnUpdate, getLastMessage, getMinutesPassed, getPreviousTime, structureNewMessage } from "../utilities/message-utilities.js";
import moment from "moment";
import logger from "../utilities/logger.js";
export const createChannel = async (req, res, next) => {
  try {
    res.status(201).send({ message: "created" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const getChannelMessages = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const { page, limit } = req.query;
    const perPage = 2;
    // 1 page is how many messages? 2?
    // lets go with 2.

    const foundChannel = await Channel.findById({ _id: channelId }).populate({
      path: "messages",
      options: {

        sort: { timestamp: 'asc' },
      }
    });

    res.status(201).send(foundChannel.messages);
  } catch (err) {
    logger.error(`GET /channels/messages ${err.message}`);
    res.status(500).send({ message: err.message });
  }
};

export const createChannelMessage = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const { user } = req;
    // the ui already has populated info, no reason to try and figure out a ton of logic each time
    // switch something.. idk yet
    const { message } = req.body;
    let responseMessage = {};

    const newMessageContent = await structureNewMessage(message);
    const foundChannel = await Channel.findOne({ _id: channelId }).populate({
      path: "messages",
    });
// just do a quick check to see who the last author is-- TODO
    // figure a way to not try and get all this info each time..
    const lastMessage = getLastMessage(foundChannel.messages);
    const previousTime = getPreviousTime(lastMessage);
    const minutesPassed = getMinutesPassed(previousTime);
    const updateLast  = decideOnUpdate(minutesPassed, lastMessage, user.username);

    if (updateLast) {
      const updatedMessage = addToPreviousMessage(foundChannel.messages, newMessageContent);
      // mongoose says this is deprecated.. need to fix

        await Message.findByIdAndUpdate(lastMessage._id, { ...updatedMessage });

        await foundChannel.save();
        responseMessage = updatedMessage;

    } else {
      const newDbMessage = new Message({
        author: user,
        content: [newMessageContent],
        date: moment(),
      });
      const savedMessage = await newDbMessage.save();
      responseMessage = savedMessage;
      foundChannel.messages.push(savedMessage._id);
      await foundChannel.save();
    }


    // dont really like how this works, but how else do we tell the ui about an updated last message?
    res.status(201).send({ message: responseMessage, merge: updateLast });
  } catch (err) {
    logger.error(`POST /channels ${err.message}`);
    res.status(500).send({ message: err.message });
  }
};

export const setUserTyping = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const { user } = req;
    const { WebsocketService } = req.app.settings;

    res.status(201).send({ message: "created" });
  } catch (err) {
    logger.error(`POST /channels/id/typing ${err.message}`);
    res.status(500).send({ message: err.message });
  }
};
