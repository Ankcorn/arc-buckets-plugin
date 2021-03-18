
function createClients (buckets) {
    const clients = buckets.map(({ name, client }) => `
const ${client} = {
	bucketName: '${name},
	async get (key) {
			const response = await s3.getObject({ Bucket: this.bucketName, Key: key }).promise();

			return {
				contentType: response.ContentType,
				eTag: response.ETag,
				data: response.Body.toString(response.ContentType.includes('image') ? 'base64' : 'utf-8')
			}
	},
	async put (key, blob) {
			const ContentType = mime.lookup(key);
			await s3.putObject({ Bucket: this.bucketName, Key: key, Body: blob, ContentType  }).promise();
	}
};
`);

    const code = `
const S3 = require('aws-sdk/clients/s3');
const mime = require('mime-types');
const runningLocally = process.env.NODE_ENV === 'testing';

const config = runningLocally ? {
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
    endpoint: 'http://127.0.0.1:4569',
		s3ForcePathStyle: true
} : {};
const s3 = new S3(config);

${clients.join('\n')}

const buckets = {
    ${buckets.map(({ client }) => client).join(', ')}
};

module.exports = buckets;

`;
    const types = `
declare type client = {
		bucketName: string;
		get(key: any): Promise<{
				contentType: string;
				eTag: string;
				data: string;
		}>;
		put(key: any, blob: any): Promise<void>;
};

declare const buckets: {
		${buckets.map(({ client }) => `${client}: client`).join(', ')}
};
	
export = buckets		
`;
    return { code, types };
}

module.exports = createClients;
