const S3rver = require('s3rver');
const path = require('path');
const { toLogicalID } = require('@architect/utils');
const createClients = require('./client');
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
    package ({ arc, cloudformation, stage = 'staging' }) {
        if (!arc.buckets) {
            return cloudformation;
        }
        const [ stackName ] = arc.app;
        console.log(cloudformation.Resources.Role.Properties.Policies);
        for (let bucket of arc.buckets) {
            const bucketResourceName = `PluginBucket${toLogicalID(bucket)}`;
            cloudformation.Resources[bucketResourceName] = {
                Type: 'AWS::S3::Bucket',
                Properties: {
                    BucketName: `${stackName}-${bucket}-${stage}`
                }
            };
        }
        return cloudformation;
    },
    pluginFunctions ({ arc, inventory }) {
        console.log(arc);
        if (!arc.buckets) return [];
        const [ stackName ] = arc.app;
        const cwd = inventory.inv._project.src;


        return [ {
            src: path.join(cwd, './src/shared/buckets'),
            body: createClients(arc.buckets.map(name => ({
                clientName: name,
                bucketName: `${stackName}-${name}-`
            })))
        } ];
    },
    sandbox: {
        async start ({ arc }) {
            console.log(arc);
            const [ stackName ] = arc.app;
            if (arc.buckets) {

                console.log(arc.buckets);
                s3Instance = new S3rver({ configureBuckets: arc.buckets.map((bucketName) => ({ name: `${stackName}-${bucketName}-testing` })), ...defaultLocalOptions });
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
