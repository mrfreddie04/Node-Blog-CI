// if (process.env.NODE_ENV === 'production') {
//   module.exports = require('./prod');
// } else if (process.env.NODE_ENV === 'ci') {
//   module.exports = require('./ci');
// } else {
//   module.exports = require('./dev');
// }
//const dotenv = require('dotenv');

process.env.NODE_ENV = process.env.NODE_ENV || "development";

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./prod');
} else if (process.env.NODE_ENV === 'ci') {
  module.exports = require('./ci');
} else {
  //console.log("DEV CONFIG");
  module.exports = require('./dev');
}

// module.exports = {
//   googleClientID: process.env.GOOGLE_CLIENT_ID,
//   googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   mongoURI: process.env.MONGODB_URI,
//   cookieKey: process.env.COOKIE_KEY,
//   port: process.env.PORT
// }