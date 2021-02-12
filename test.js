process.env.NODE_ENV = 'testing';
const plugin = require('./index');
const client = require('./client');
plugin.sandbox.start({ inv: { _project: { arc: { buckets: ['bucket-1'] }}}}).then(async () => {
	console.log('hi')

	await client.buckets.upload({
		Bucket: client.tableNameHelper('bucket-1'),
		Body: 'test',
		Key: 'wtf.txt'
	}).promise()
}).catch(e => console.log(e))
