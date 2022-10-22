const { clearHash } = require("../services/cache");

module.exports = async (req, res, next) => {
  const userId = req.user.id;
  
  await next();

  await clearHash(userId);
};
