const { createClient } = require('redis');
const keys = require('../config/keys');

const client = createClient({
	url: keys.redisUrl
	// socket: {
	// 	host: keys.redisHost,
	// 	port: parseInt(keys.redisPort)
	// },
  // password: keys.redisPassword
});

//const client = createClient("redis://127.0.0.1:6379");

client.connect();

module.exports = { client };