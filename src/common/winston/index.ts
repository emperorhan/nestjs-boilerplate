import {
    addColors,
    Logger,
    createLogger,
    format,
    transports,
    LoggerOptions
} from "winston";
import rTracer from "cls-rtracer";
import { MongoDB } from "winston-mongodb";
import { config } from "@config";
// import moment from "moment";

const { splat, json, timestamp, align, printf } = format;

const colorConfig = {
    levels: {
        error: 0,
        debug: 1,
        warn: 2,
        data: 3,
        info: 4,
        verbose: 5,
        silly: 6,
        custom: 7
    },
    colors: {
        error: "red",
        debug: "blue",
        warn: "yellow",
        data: "grey",
        info: "green",
        verbose: "cyan",
        silly: "magenta",
        custom: "yellow"
    }
};

const logFormat = printf(info => {
    const rid = rTracer.id();
    return JSON.stringify({
        timestamp: info.timestamp,
        context: info.context,
        level: info.level,
        requestId: rid,
        message: info.message ? info.message : undefined
    });
});

const loggerOptions: LoggerOptions = {
    // level: "error",
    // levels: colorConfig.levels,
    format: format.combine(
        json(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        align(),
        splat(),
        // prettyPrint(),
        // colorize(),
        logFormat
    ),
    // defaultMeta: { service: "user-service" },
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        // new transports.Console(),
        new transports.Console({
            level: "debug",
            handleExceptions: true
        }),
        new MongoDB({
            // mongodb://<user>:<pass>@<host>:<port>/<db_name>
            // MongoDB connection uri, pre-connected MongoClient object or promise which resolves to a pre-connected MongoClient object.
            db: `mongodb://${config.mongodbUser}:${config.mongodbPassword}@${config.mongodbHost}:${config.mongodbPort}/admin`,
            // The name of the collection you want to store log messages in, defaults to 'log'.
            collection: "sample-log-info",
            // Level of messages that this transport should log, defaults to 'info'.
            level: "info",
            // In case this property is true, winston-mongodb will try to create new log collection as capped, defaults to false.
            capped: true,
            options: {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        })
        // new transports.File({
        //     filename: `logs/info/${moment().format("YYYY-MM-DD")}`,
        //     level: "info",
        //     handleExceptions: true,
        //     zippedArchive: true, // TODO: 압축에 따른 CPU 오버헤드 고려해보기
        // }),
        // new transports.File({
        //     filename: `logs/error/${moment().format("YYYY-MM-DD")}`,
        //     level: "error",
        //     handleExceptions: true,
        //     zippedArchive: true, // TODO: 압축에 따른 CPU 오버헤드 고려해보기
        // }),
        // new transports.File({
        //     filename: `logs/warn/${moment().format("YYYY-MM-DD")}`,
        //     level: "warn",
        //     handleExceptions: true,
        //     zippedArchive: true, // TODO: 압축에 따른 CPU 오버헤드 고려해보기
        // }),
        // new transports.File({
        //     filename: `logs/debug/${moment().format("YYYY-MM-DD")}`,
        //     level: "debug",
        //     handleExceptions: true,
        //     zippedArchive: true, // TODO: 압축에 따른 CPU 오버헤드 고려해보기
        // }),
        // new transports.File({
        //     filename: `logs/verbose/${moment().format("YYYY-MM-DD")}`,
        //     level: "verbose",
        //     handleExceptions: true,
        //     zippedArchive: true, // TODO: 압축에 따른 CPU 오버헤드 고려해보기
        // }),
    ],
    exitOnError: false
};

addColors(colorConfig.colors);

function createAppLogger(): Logger {
    return createLogger(loggerOptions);
}

const logger: Logger = createAppLogger();

const errorStream = {
    write: (message: unknown): void => {
        createLogger(loggerOptions).error(message);
    }
};

export { logger, loggerOptions, errorStream };
