const Router = require("koa-router");

// routes
const admin = require("./admin/routes");
const users = require("./users/routes");

// prefix
const v1 = new Router({
  prefix: "/v1",
});

// append
v1.use(admin.routes());
v1.use(users.routes());

module.exports = v1;
