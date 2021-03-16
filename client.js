
function createClients (buckets) {
    const clients = buckets.map(({ bucketName, clientName }) => `
const ${clientName} = {
	bucketName: '${bucketName}' + process.env.NODE_ENV,
	async get (key) {
			const response = await s3.getObject({ Bucket: this.bucketName, Key: key }).promise();
			return response.Body.toString();
	},
	async put (key, blob) {
			await s3.putObject({ Bucket: this.bucketName, Key: key, Body: blob }).promise();
	}
};
`);

    const template = `
const S3 = require('aws-sdk/clients/s3');

const runningLocally = process.env.NODE_ENV === 'testing';

const config = runningLocally ? {
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
    endpoint: 'http://127.0.0.1:4569'
} : {};

const s3 = new S3(config);

${clients.join('\n')}

const buckets = {
    ${buckets.map(({ clientName }) => clientName).join(', ')}
};

module.exports = buckets;

`;

    return template;
}

module.exports = createClients;
