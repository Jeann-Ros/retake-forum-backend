import express from "express";
import __dirname from "../utils/path-utils.ts";
import path from "path";
import fs from "fs";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import cors from "cors";

const urlencodedMiddleware = express.urlencoded({ extended: true });
const jsonMiddleware = express.json();

const securityMiddleware = helmet();

const compressionMiddlewware = compression();

const rateLimitMiddleware = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_, res) => {
    return res.status(429).json({
      message: "Muitas requisições, tente novamente em alguns minutos.",
    });
  },
});

const logFile = fs.createWriteStream(
  path.join(__dirname, "./logs/access.log"),
  {
    flags: "a",
  },
);
const morganMiddleware = morgan("combined", { stream: logFile });

const corsMiddleware = cors({ origin: "*" });

export {
  urlencodedMiddleware,
  jsonMiddleware,
  securityMiddleware,
  compressionMiddlewware,
  rateLimitMiddleware,
  morganMiddleware,
  corsMiddleware,
};
