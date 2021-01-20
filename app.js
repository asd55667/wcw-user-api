// koa family
const Koa = require("koa");
const static = require("koa-static");
const bodyParser = require("koa-bodyparser");
const koaJson = require("koa-json");
const conditional = require("koa-conditional-get");
const etag = require("koa-etag");
const cors = require("koa2-cors");
const helmet = require("koa-helmet");

const mongoose = require("mongoose");

// local
const { requestLogger, logger } = require("./middleware/logger");
const { responseTime, errors } = require("./middleware");
const { apis } = require("./api");

// instance
const app = new Koa();

// database
mongoose.connect(
  "mongodb://127.0.0.1:27017/wcw-wondercv",
  // process.env.USERS_MONGO
  {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
);

const db = mongoose.connection;
db.on("error", (err) => {
  logger.error(err);
});
db.once("connected", () => {
  logger.info("Mongo connected");
  app.emit("ready");
});
db.on("reconnected", () => {
  logger.info("Mongo re-connected");
});
db.on("disconnected", () => {
  logger.info("Mongo disconnected");
});

// middlewares
app.use(errors);
app.use(conditional());
app.use(etag());
app.use(bodyParser());
app.use(koaJson());
// app.use(helmet());
app.use(
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PATCH", "DELETE"],
    allowHeaders: ["Content-Type", "Accept", "wcw-key"],
    exposeHeaders: ["spacex-api-cache", "spacex-api-response-time"],
  })
);
app.use(responseTime);
// app.use(requestLogger);
app.use(static(__dirname + "/public"));
app.use(apis.routes()); //.use(apis.allowedMethods());

module.exports = app;
