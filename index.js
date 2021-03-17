const S3rver = require('s3rver');
const path = require('path');
const { toLogicalID } = require('@architect/utils');
const createClients = require('./client');
const buckets = require('./sample-project/src/shared/buckets');
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
        for (let bucket of arc.buckets) {
            const bucketResourceName = `PluginBucket${toLogicalID(bucket)}`;
            cloudformation.Resources[bucketResourceName] = {
                Type: 'AWS::S3::Bucket',
                Properties: {
                    BucketName: `${stackName}-${bucket}-${stage}`
                }
            };
        }
        cloudformation.Resources.Role.Properties.Policies.push({
            PolicyName: 'ArcBucketsPlugin',
            PolicyDocument: {
                Statement: [
                    {
                        Effect: 'Allow',
                        Action: [
                            's3:GetObject',
                            's3:PutObject'
                        ],
                        Resource: arc.buckets.reduce((resources, bucket) => [ ...resources, `arn:aws:s3:::${stackName}-${bucket}-${stage}`, `arn:aws:s3:::${stackName}-${bucket}-${stage}/*` ], [])
                    }
                ]
            }
        });

        return cloudformation;
    },
    pluginFunctions ({ arc, inventory }) {
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
            const [ stackName ] = arc.app;
            if (arc.buckets) {
                s3Instance = new S3rver({ configureBuckets: arc.buckets.map((bucketName) => ({ name: `${stackName}-${bucketName}-testing` })), ...defaultLocalOptions });
                await s3Instance.run();
            }
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
