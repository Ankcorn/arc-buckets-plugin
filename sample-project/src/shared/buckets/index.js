
const S3 = require('aws-sdk/clients/s3');

const runningLocally = process.env.NODE_ENV === 'testing';

const config = runningLocally ? {
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
    endpoint: 'http://127.0.0.1:4569'
} : {};

const s3 = new S3(config);


const one = {
    bucketName: '${stackName}-${name}-' + process.env.NODE_ENV,
    async get (key) {
        const response = await s3.getObject({ Bucket: this.bucketName, Key: key }).promise();
        return response.Body.toString();
    },
    async put (key, blob) {
        await s3.putObject({ Bucket: this.bucketName, Key: key, Body: blob }).promise();
    }
};


const two = {
    bucketName: '${stackName}-${name}-' + process.env.NODE_ENV,
    async get (key) {
        const response = await s3.getObject({ Bucket: this.bucketName, Key: key }).promise();
        return response.Body.toString();
    },
    async put (key, blob) {
        await s3.putObject({ Bucket: this.bucketName, Key: key, Body: blob }).promise();
    }
};


const three = {
    bucketName: '${stackName}-${name}-' + process.env.NODE_ENV,
    async get (key) {
        const response = await s3.getObject({ Bucket: this.bucketName, Key: key }).promise();
        return response.Body.toString();
    },
    async put (key, blob) {
        await s3.putObject({ Bucket: this.bucketName, Key: key, Body: blob }).promise();
    }
};


const buckets = {
    one, two, three
};

module.exports = buckets;

