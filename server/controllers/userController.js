import User from "../models/User.js";
import {
  mongoUserFriendsoUiFriend,
  mongoUserToUiUser,
} from "../parsers/userParser.js";
import logger from "../utilities/logger.js";
import webpush from "web-push";
import { mainUser } from "../utilities/inital-data.js";

const createMainUser = async () => {
  const createdUser = new User({
    ...mainUser
  });
  const savedMainUser = await createdUser.save();
  return savedMainUser;
};

export const createUser = async (req, res) => {
  try {
    const { user } = req.body;
    // all for development so i can clear the db whenever
    let foundMainUser = await User.findOne({ username: mainUser.username });
    if (!foundMainUser) foundMainUser = await createMainUser();
    const createdUser = new User({
      ...user,
      // give the poor guy some base friends
      friends: [foundMainUser._id],
    });
    const savedUser = await createdUser.save();
    foundMainUser.friends.push(savedUser._id);
    await foundMainUser.save();
    const uiUser = mongoUserToUiUser(savedUser);
    res.cookie("ct_session", uiUser.id);
    res.status(201).send(uiUser);
  } catch (error) {
    logger.error(`creating user ${error.message}`);
    res.status(500).send({
      message: {
        content: "An error occured creating user",
        info: error.message,
      },
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { user } = req.body;
    const foundUser = await User.findOne({
      username: user.username,
    });
    if (!foundUser) return createUser(req, res);
    const foundMainUser = await User.findOne({ username: mainUser.username });
    foundMainUser.friends.push(foundUser._id);
    await foundMainUser.save();
    foundUser.status = "Online";
    await foundUser.save();
    const uiUser = mongoUserToUiUser(foundUser);

    res.cookie("ct_session", uiUser.id);
    res.status(201).send(uiUser);
  } catch (error) {
    logger.error(`logging in ${error.message}`);
    res.status(500).send({
      message: {
        content: "An error occured logging in user",
        info: error.message,
      },
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const { user } = req;
    const foundUser = await User.findOne({
      username: user.username,
    });
    foundUser.status = "Offline";
    await foundUser.save();
    res.clearCookie("ct_session");
    res.status(201).send("Successfully logged out");
  } catch (error) {
    logger.error(`logging out ${error.message}`);
    res.status(500).send({
      message: {
        content: "An error occured logging out user",
        info: error.message,
      },
    });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { user } = req;
    const foundUser = await User.findOne({
      username: user.username,
    }).populate("friends");

    const uiFriends = foundUser.friends.map((user) =>
      mongoUserFriendsoUiFriend(user)
    );
    res.status(201).send(uiFriends);
  } catch (error) {
    res.status(500).send({
      message: {
        content: "An error occured getting user friends in user",
        info: error.message,
      },
    });
  }
};

export const subscribeToNotifications = async (req, res) => {
  const subscription = req.body;

  res.status(201).json({});

  const payload = JSON.stringify({ title: "Push Test" });
  webpush
    .sendNotification(subscription, payload)
    .catch((err) => console.log(err));
};

export const unsubscribeToNotifications = async (req, res) => {
  try {
    subscription = null;
    clearInterval(pushIntervalID);
    res.status(200);
  } catch (error) {
    console.log(error);
  }
};
