const mongoose  = require("mongoose");
// const keys = require('../config/keys');

// mongoose.connection.once("open", () => {
//   console.log("MongoDB connection ready");
// });

// mongoose.connection.on("error", (err) => {
//   console.error(err);
// });

// async function mongoConnect(url=keys.mongoURI) {
//   await mongoose.connect(url);
// }

async function mongoDisconnect() {
  await mongoose.disconnect();
}  

module.exports = {
  //mongoConnect,
  mongoDisconnect
}  