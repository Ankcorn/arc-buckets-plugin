const S3rver = require('s3rver');
const { invokeLambda } = require('@architect/sandbox')
const defaultLocalOptions = {
	port: 4569,
	address: "localhost",
	directory: './buckets',
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
	pluginFunctions: function createBucketEventHandlers(arc, inventory) {
		if(!arc.bucketEvents) return [];
		const cwd = inventory.inv._project.src
		return arc.bucketEvents.map((bucketEvent) => {
      let rulesSrc = path.join(cwd, 'src', 'bucketEvents', bucketEvent)
      return {
        src: rulesSrc,
        body: `exports.handler = async function (event) {
  console.log(event);
};`
      }
    })
  }
	},
  sandbox: {
    start: async function startS3rver(arc) {
			if(arc.buckets) {
				s3Instance = new S3rver({ configureBuckets: arc.buckets.map(b=> ({ name: `${b}-testing` })), ...defaultLocalOptions})
				await s3Instance.run()
				console.log('sandbox has started')
			}
			if(arc.bucketEvents) {
				let bucketEventSrcs = module.exports.pluginFunctions(arc, inventory).map(bucketEvents=> bucketEvent.src)
			}
    },
    end: async function endS3rver() {
			return s3Instance.close()
    }
  }
}
