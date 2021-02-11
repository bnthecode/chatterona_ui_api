import dotEnv from "dotenv";

dotEnv.config();

const config = {
  server: {
    port: 8080,
  },
  http: {
    timeout: 10000,
    withCredentials: process.env.AUTH_ENABLED === "true",
  },
  auth: {
    auth_enabled: process.env.AUTH_ENABLED === "true",
    allowedOrigins: process.env.FRONT_END_URL,
  },
};

export default config;
