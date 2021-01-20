const http = require("http");
const mongoose = require("mongoose");

const { logger } = require("./middleware/logger");
const app = require("./app");

const port = process.env.PORT || 8127;
const server = http.createServer(app.callback());

const gracefulShutdown = () => {
  mongoose.connection.close(false, () => {
    logger.info("Mongo closed");
    server.close(() => {
      logger.info("resume backend shutting down");
      process.exit();
    });
  });
};

server.listen(port, "0.0.0.0", () => {
  logger.info(`Running on port: ${port}`);

  process.on("SIGTERM", gracefulShutdown);
  process.on("uncaughtException", gracefulShutdown);
  process.on("unhandledRejection", gracefulShutdown);
});

// http://lookdiv.com/index/index/indexcodeindex.html 5263
