import { StatusCodes } from "http-status-codes";
import { pinoHttp, type Options } from "pino-http";
import { isProd } from "../constants/index.js";
import logger from "./logger.js";

const options: Options = {
  logger,

  autoLogging: !isProd,

  customSuccessMessage(req, res) {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },

  customLogLevel(_req, res, err) {
    if (err || res.statusCode >= StatusCodes.INTERNAL_SERVER_ERROR) return "error";
    if (res.statusCode >= StatusCodes.BAD_REQUEST) return "warn";
    return isProd ? "silent" : "info";
  },

  ...(isProd && {
    serializers: {
      req: () => undefined,
      res: () => undefined,
    },
  }),
};

export const httpLogger = pinoHttp(options);
