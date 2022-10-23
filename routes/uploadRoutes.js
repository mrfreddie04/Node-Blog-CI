const AWS = require("aws-sdk");
const path = require('path');
const { v4: uuid } = require('uuid');
const keys = require('../config/keys');
const requireLogin = require('../middlewares/requireLogin');

const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey
});

module.exports = app => {
  app.post('/api/upload', requireLogin, (req, res) => {
    const { type, ext } = req.body;

    const key = `${req.user.id}/${uuid()}.${ext}`;
    s3.getSignedUrl(
      "putObject", 
      {
        Bucket: keys.bucket,
        Key: key,
        ContentType: type
      }, 
      (error,url) => {
        if(error) {
          res.send(400, err);
        } else {
          res.send({key, url});
        }
      });
  });
}  