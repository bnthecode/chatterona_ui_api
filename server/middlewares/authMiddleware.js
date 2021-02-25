import config from "../config.js";
import jsonwebtoken from "jsonwebtoken";
import logger from "../utilities/logger.js";
import userModel from "../models/userModel.js";

const {
  auth: { jwt },
} = config;
const { jwt_encryption_key } = jwt;

export const createToken = (user) => {
  const token = jsonwebtoken.sign({ user }, jwt_encryption_key, jwt.jwt_config);
  return token;
};

export const httpAuthMiddleware = async (req, res, next) => {
  try {
    const cookie = req.cookies.ct_session;
    console.log(cookie, '----------------------------')
    if (req.originalUrl !== "/api/users/login" && cookie) {
      const foundUser = await userModel.findById(cookie);
      console.log(foundUser, '----------------------------')
      req.user = {
        id: foundUser._id,
        username: foundUser.username,
        photoURL: foundUser.photoURL,
        status: foundUser.status,
      };
    }
    next();
  } catch (error) {
    res.status(401).send("you aint gotta cookie");

    next();
    // normally send a 401
  }
};
