const mongoose = require("mongoose");

const db = mongoose.connection.useDb("wcw-wondercv", { useCache: true });
// const db = mongoose.connection;
// console.log(db);

/**
 * Authentication middleware
 */

authMap = {
  superuser: [
    "user:list",
    "user:one",
    "user:query",
    "user:create",
    "user:update",
    "user:delete",
    "user:find",
  ],
  user: [[]],
  create: ["user:create"],
  update: ["user:update"],
  delete: ["user:delete"],
};

module.exports = async (ctx, next) => {
  const key = +ctx.request.headers["wcw-key"];

  // console.log(typeof key);
  console.log("auth");
  if (key) {
    const user = await db.collection("users").findOne({ key });
    if (user?.key === key) {
      ctx.state.roles = authMap[user.role];
      await next();
      return;
    }
  }
  ctx.status = 401;
  ctx.body = "go home";
};
