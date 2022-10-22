const Keygrip = require("keygrip");
const Buffer = require('safe-buffer').Buffer;
const keys = require('../../config/keys');
const cookieKey = new Keygrip([keys.cookieKey]);

module.exports = (user) => {
  const sessionObj = {passport:{user: user._id.toString()}};
  const session = Buffer.from(JSON.stringify(sessionObj)).toString('base64');
  const sig = cookieKey.sign("session=" + session);

  return { session, sig };
};

