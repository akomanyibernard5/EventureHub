const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_ID, 
  secretAccessKey: process.env.AWS_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const rekognition = new AWS.Rekognition();

module.exports = rekognition;
