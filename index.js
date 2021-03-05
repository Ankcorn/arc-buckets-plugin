const S3rver = require('s3rver');
// const path = require('path');
// const { invokeLambda } = require('@architect/sandbox');

const defaultLocalOptions = {
    port: 4569,
    address: 'localhost',
    directory: './buckets',
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
    resetOnClose: true
};
let s3Instance;
module.exports = {
    package: function extendCloudFormation (arc, sam, stage = 'staging', inventory) {
        if (!arc.buckets) {
            return sam;
        }

        for (let bucket of arc.buckets) {

            sam.resources[bucket] = {
                Type: 'AWS::S3::Bucket',
                Properties: {
                    BucketName: `arc-${bucket}-${stage}`
                }
            };
        }

        return sam;
    },
    //     pluginFunctions: function createBucketEventHandlers (arc, inventory) {

    //         const cwd = inventory.inv._project.src;
    //         return arc.buckets.filter(bucket => bucket.length === 2).map(([ bucket ]) => {
    //             let rulesSrc = path.join(cwd, 'src', 'buckets', bucket);
    //             return {
    //                 src: rulesSrc,
    //                 body: `exports.handler = async function (event) {
    //   console.log(event);
    // };`
    //             };
    //         });
    //     },
    sandbox: {
        async start (arc) {
            if (arc.buckets) {
                console.log(arc.buckets);
                s3Instance = new S3rver({ configureBuckets: arc.buckets.map(([ b ]) => ({ name: `${b}-testing` })), ...defaultLocalOptions });
                await s3Instance.run();
                console.log('sandbox has started');
            }

            // let bucketEventSrcs = module.exports.pluginFunctions(arc, inventory).map(bucketEvent => bucketEvent.src);
            // console.log(bucketEventSrcs);
            // // const bucketNames = bucketEventSrcs.map(str => str.replace('test/src/buckets/', ''))
            // // console.log(bucketNames)
            // s3Instance.on('event', (e) => {
            //     const { s3: { bucket }, eventName } = e.Records[0];
            //     console.log(bucket);
            //     if (bucketNames.includes(bucket.name)) {
            //         invokeLambda ? invokeLambda(e) : console.log(e);
            //     }
            // });
        },
        end: async function endS3rver () {
            try {
                return await s3Instance.close();
            }
            catch (e) {
                console.log(e);
            }
        }
    }
};
