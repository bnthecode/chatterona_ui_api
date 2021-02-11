import router from "./router.js";
import cors from "cors";
import bodyParser from "body-parser";
import express from "express";
import http from "http";
import config from "./config.js";

import { authMiddleware } from "./middlewares/authMiddleware.js";

const {
  auth: { auth_enabled, allowedOrigins },
  server: { port },
  server: rootConfig,
} = config;



const app = express(rootConfig);
const server = http.createServer(app);
app.use(bodyParser.json());
app.use(
  cors({
    credentials: auth_enabled,
  })
);
app.use("/api", authMiddleware, router);


server.listen(port, () => {
  console.log(`ui api running on port ${port}`);
});
