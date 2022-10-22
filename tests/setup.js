jest.setTimeout(15000);

const mongoose  = require("mongoose");
const keys = require('../config/keys');
require('../models/User');

mongoose.Promise = global.Promise; 
mongoose.connect(keys.mongoURI);
