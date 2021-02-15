import { getUserCredentials } from "../middlewares/authMiddleware.js";
import User from "../models/userModel.js";
import { mongoUserToUiUser } from "../parsers/userParser.js";
import logger from "../utilities/logger.js";

export const createUser = async (req, res) => {
  try {
    const { user } = req.body;
    const createdUser = new User({
     ...user,
    });

    
    
    const savedUser = await createdUser.save();
    
    const uiUser = mongoUserToUiUser(savedUser)
    const { cookie, token } = getUserCredentials(savedUser);
    res.cookie(cookie.cookie_name, token, { ...cookie.cookie_config });
    res.status(201).send({...uiUser, token});
  } catch (error) {
    logger.error(`creating user ${err.message}`);
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
    foundUser.status = 'Online';
    await foundUser.save();
    const uiUser = mongoUserToUiUser(foundUser);
    const { cookie, token } = getUserCredentials(foundUser);
    res.cookie(cookie.cookie_name, token, { ...cookie.cookie_config });
    res.status(201).send({ ...uiUser, token});
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
    foundUser.status = 'Offline';
    await foundUser.save();
    const { cookie } = getUserCredentials(user);
    res.clearCookie(cookie.cookie_name)
    res.status(201).send('Successfully logged out');
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