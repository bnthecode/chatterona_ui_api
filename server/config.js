import dotEnv from "dotenv";
dotEnv.config();

const config = {
  server: {
    port: 3003,
  },
  http: {
    timeout: 10000,
    base_url: process.env.NODE_BASE_URL || "http://localhost:8080/api",
    withCredentials: process.env.AUTH_ENABLED === "true",
  },
  auth: {
    auth_enabled: process.env.AUTH_ENABLED === "true",
    allowedOrigins: process.env.FRONT_END_URL,
    jwt: {
      jwt_encryption_key: process.env.JWT_ENCRYPTION_KEY,
      jwt_config: {
        algorithm: "HS256",
        expiresIn: 20000,
      },
    },
    cookie: {
      cookie_name: "chatterona-session",
      cookie_config: {
        maxAge: 24 * 60 * 60,
        httpOnly: true,
        secure: false,
      },
    },
  },
 
  database: {
    connection_string: process.env.DATABASE_CONNECTION_STRING,
    database_config: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

};

export default config;

