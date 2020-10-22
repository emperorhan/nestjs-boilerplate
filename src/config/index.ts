/* eslint-disable @typescript-eslint/no-empty-function */
import { config as _config } from "dotenv";
_config({ path: __dirname + "/../../.env" });
(process as any).send = process.send || function() {};

export const config = {
    // Base
    isProduction: process.env.NODE_ENV === "production",
    // General
    appName: process.env.APP_NAME || "nestjs-boilerplate",
    appTitle: process.env.APP_TITLE || "nestjs-boilerplate",
    appDescription: process.env.APP_DESCRIPTION || "nestjs-boilerplate",
    // API
    apiVersion: process.env.API_VERSION || "1.0",
    // Server
    host: process.env.HOST || "0.0.0.0",
    port: parseInt(process.env.PORT) || 3000,
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 10000,
    swaggerPath: process.env.SWAGGER_PATH || "/api",
    // Logger
    mongodbUser: process.env.MONGODB_USER || "",
    mongodbPassword: process.env.MONGODB_PASSWORD || "",
    mongodbHost: process.env.MONGODB_HOST || "121.166.76.122",
    mongodbPort: process.env.MONGODB_PORT || "22222"
};

import LedgisModuleConfig from "./modules/ledgis";
import LoggerModuleConfig from "./modules/logger";

export { LedgisModuleConfig, LoggerModuleConfig };
