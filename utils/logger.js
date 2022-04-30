/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

var winston = require("winston");
require("winston-daily-rotate-file");

var transport = new winston.transports.DailyRotateFile({
  filename: "hep-logs-%DATE%.log",
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "5m",
  maxFiles: "14d",
  level: "error",
  dirname: "./logs",
});

transport.on("rotate", function (oldFilename, newFilename) {
  // do something fun
});

const logger = winston.createLogger({
  transports: [
    transport,
    new winston.transports.File({
      filename: "error2.log",
      level: "error",
      json: true,
      format: winston.format.combine(
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.printf((info) =>
          JSON.stringify({ [info.timestamp]: `${info.message}` })
        )
      ),
    }),
    new winston.transports.Console({
      level: "info",
      json: true,
      format: winston.format.combine(
        winston.format.timestamp({ format: "HH:mm:ss:ms" }),
        winston.format.colorize(),
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf((e) => {
          console.log(e.level);
        })
      ),
    }),
  ],
});

module.exports = { logger };
