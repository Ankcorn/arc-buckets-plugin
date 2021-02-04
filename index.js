const S3rver = require('s3rver');

const defaultLocalOptions = {
	port: 4569,
	address: "localhost",
	location: ".",
	accessKeyId: "S3RVER",
	secretAccessKey: "S3RVER",
	resetOnClose: true 
};

let s3Instance;

module.exports = {
	package: async function extendCloudFormation (arc, sam, stage='staging', inventory) {
		if(!arc.buckets) {
			return sam;
		}

		for(let bucket of buckets) {
			sam.resources[bucket] = {
				Type: 'AWS::S3::Bucket',
				Properties: {
					BucketName: `arc-${bucket}-${stage}`
				}
			}
		}
		return sam
	},
  sandbox: {
    start: function () {
			const arc = inventory.inv._project.arc;
				s3Instance = new S3rver({ configureBuckets: arc.buckets.map(b=> `${b}-testing`), ...defaultLocalOptions})
				await s3Instance.run()
    },
    end: async function () {
			return s3Instance.close()
    }
  }
}
