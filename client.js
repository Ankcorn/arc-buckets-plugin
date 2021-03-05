// // This would probably be its own dependency

// const S3 = require('aws-sdk/clients/s3');

// let runningLocally = process.env.NODE_ENV === 'testing';

// const config = runningLocally ? {
// 	accessKeyId: "S3RVER",
// 	secretAccessKey: "S3RVER",
// 	endpoint: 'http://127.0.0.1:4569'
// } : {};

// module.exports = {
// 	buckets: new S3({ region: process.env.AWS_DEFAULT_REGION, s3ForcePathStyle: true, ...config }),
// 	// to eventually become real service descovery or something
// 	tableNameHelper: (name) => `${name}-${process.env.NODE_ENV}`
// }
