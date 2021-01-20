const Router = require("koa-router");
const uuidv4 = require("uuid").v4;

const User = require("./model");
const { auth, authz } = require("../../../middleware");

const router = new Router({
  prefix: "/users",
});

// Get all users
router.get("/", auth, authz("user:list"), async (ctx) => {
  try {
    const result = await User.find({});
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Get one user
router.get("/:id", auth, authz("user:one"), async (ctx) => {
  // console.log(':id', ctx.params.id);
  const result = await User.findById(ctx.params.id);
  if (!result) {
    ctx.throw(404);
  }
  ctx.status = 200;
  ctx.body = result;
  // ctx.body = { name: result.name, role: result.role };
});

// Query users
router.post("/query", auth, authz("user:query"), async (ctx) => {
  const { query = {}, options = {} } = ctx.request.body;
  try {
    const result = await User.paginate(query, options);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Create a user
router.post("/", auth, authz("user:create"), async (ctx) => {
  console.log(ctx.request.body);
  try {
    const user = new User(ctx.request.body);
    await user.save();
    ctx.status = 201;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Get one user, Create if not exists
router.post("/find", auth, authz("user:find"), async (ctx) => {
  console.log(ctx.request.body);
  let result = await User.findOne(ctx.request.body);
  if (!result) {
    try {
      result = new User(
        Object.assign({}, ctx.request.body, { role: "user", key: uuidv4() })
      );
      await result.save();
      ctx.status = 201;
    } catch (error) {
      console.log(error);
      ctx.throw(400, error.message);
    }
  }
  ctx.status = 200;
  ctx.body = result;
});

// Update a user
router.patch("/:id", auth, authz("user:update"), async (ctx) => {
  try {
    await User.findByIdAndUpdate(ctx.params.id, ctx.request.body, {
      runValidators: true,
    });
    ctx.status = 200;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Delete a user
router.delete("/:id", auth, authz("user:delete"), async (ctx) => {
  try {
    await User.findByIdAndDelete(ctx.params.id);
    ctx.status = 200;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

module.exports = router;
