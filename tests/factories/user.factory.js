const mongoose  = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const User = mongoose.model('User');

module.exports = async () => {
  //const user = await new User({}).save();

  const user = await new User({
    googleId: uuidv4(),
    displayName: "User_"+uuidv4()
  }).save();  

  return user;
};
