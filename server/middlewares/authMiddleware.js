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

console.log('eee',req.originalUrl)
    const cookie = req.cookies.ct_session;
    if (req.originalUrl !== "/api/users/login" && cookie) {

      const foundUser = await userModel.findById(cookie);

      
      req.user = {
        ...foundUser.toObject(),
        id: foundUser._id,

      }
    }
    next();
  } catch (error) {
    res.status(401).send("you aint gotta cookie");

    next();
    // normally send a 401
  }
};
