import config from "../config.js";
import jsonwebtoken from "jsonwebtoken";
import logger from "../utilities/logger.js";

const {
  auth: {
    jwt,
  },
} = config;
const { jwt_encryption_key } = jwt;

export const buildReqUser = (token, req, next) => {
  const { user } = token;
  req.user = {
    ...user,
    id: user._id,
  };
  next();
};
export const createToken = (user) => {
  const token = jsonwebtoken.sign({ user }, jwt_encryption_key, jwt.jwt_config);
  return { token };
};

export const httpAuthMiddleware = async (req, res, next) => {
  try {
    const cookie = req.cookies.ct_session;
    if (req.originalUrl !== "/api/users/login") {
      const decodedToken = jsonwebtoken.verify(cookie, jwt_encryption_key);
      logger.success("user set successfully");
      return buildReqUser(decodedToken, req, next);
    }
    next();
  } catch (error) {
    logger.error(
      `auth middleware ---> setting user to dev user ${error.message}`
    );
    res.status(401).send("You have been logged out");

    // normally send a 401
  }
};
