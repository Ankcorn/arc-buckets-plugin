process.env.NODE_ENV = 'testing';
process.env.AWS_DEFAULT_REGION = 'eu-west-1';
const parser = require('@architect/parser')
const plugin = require('./src/index');
const client = require('./client');

const app = `
@app
my-arc-app

@buckets
bucket-1 s3:ObjectCreated:*
bucket-2

@http
/hello

@plugins
arc-buckets-plugin
`;

const config = parser(app)
console.log(config);

const inventory = {
	inv: {
		_project: {
			src: 'test'
		}
	}
}

plugin.sandbox.start(config, inventory).then(async () => {

	await client.buckets.upload({
		Bucket: client.tableNameHelper('bucket-1'),
		Body: 'test',
		Key: 'wtf.txt'
	}).promise()
}).catch(e => console.log(e))
