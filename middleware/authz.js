/**
 * Authorization middleware
 *
 * @param   {String}   role   Role for protected route
 * @returns {void}
 */

module.exports = (role) => async (ctx, next) => {
  console.log("authz");
  const { roles } = ctx.state;
  const allowed = roles.includes(role);
  // console.log(roles, role, allowed);
  if (allowed) {
    await next();
    return;
  }
  ctx.status = 403;
};
