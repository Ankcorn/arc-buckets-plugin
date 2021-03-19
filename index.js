const S3rver = require('s3rver');
const path = require('path');
let invokeLambda = require('@architect/sandbox/invokeLambda');
const createLambdaJSON = require('@architect/package/createLambdaJSON');
const { toLogicalID } = require('@architect/utils');
const fs = require('fs-extra');
const camelcase = require('camelcase');

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

function parseBuckets (arc, stage) {
    const [ stackName ] = arc.app;
    return arc.buckets.map((bucket) => {
        if (typeof bucket === 'string') {
            return {
                resource: `PluginBucket${toLogicalID(bucket)}`,
                name: `${stackName}-${bucket}-${stage}`,
                client: camelcase(bucket)
            };
        }

        const [ [ name, settings ] ] = Object.entries(bucket);
        return {
            resource: `PluginBucket${toLogicalID(name)}`,
            name: `${stackName}-${name}-${stage}`,
            lambda: settings.triggers && `${name}-${settings.triggers}`,
            client: camelcase(name),
            settings
        };
    });
}

module.exports = {
    package ({ arc, cloudformation, stage = 'staging', inventory }) {
        const cwd = inventory.inv._project.src;
        if (!arc.buckets) {
            return cloudformation;
        }
        const buckets = parseBuckets(arc, stage);
        for (let bucket of buckets) {
            cloudformation.Resources[bucket.resource] = {
                Type: 'AWS::S3::Bucket',
                Properties: {
                    BucketName: bucket.name
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
                        Resource: buckets.reduce((resources, bucket) => [ ...resources, `arn:aws:s3:::${bucket.name}`, `arn:aws:s3:::${bucket.name}/*` ], [])
                    }
                ]
            }
        });

        for (let bucket of buckets.filter(b => b.settings && b.settings.triggers)) {

            /** Add Lambda to be invoked */
            const src = path.join(cwd, 'src', 'buckets', bucket.lambda);
            const [ functionName, functionDef ] = createLambdaJSON({ inventory, src  });
            cloudformation.Resources[functionName] = functionDef;

            /** Add Lambda permission so s3 can invoke it */
            cloudformation.Resources[`${functionName}InvokePermission`] = {
                Type: 'AWS::Lambda::Permission',
                DependsOn: functionName,
                Properties: {
                    FunctionName: { 'Fn::GetAtt': [ functionName, 'Arn' ] },
                    Action: 'lambda:InvokeFunction',
                    Principal: 's3.amazonaws.com',
                    SourceAccount: { Ref: 'AWS::AccountId' },
                    SourceArn: `arn:aws:s3:::${bucket.name}`
                }
            };

            /** Add s3 Notification Configuration so it knows when to invoke the lambda */
            cloudformation.Resources[bucket.resource].Properties.NotificationConfiguration = {
                LambdaConfigurations: [ {
                    Event: bucket.settings.triggers === 'create' ? 's3:ObjectCreated:*' : 's3:ObjectRemoved:*',
                    Function:  { 'Fn::GetAtt': [ functionName, 'Arn' ] }
                } ]
            };
        }

        return cloudformation;
    },
    pluginFunctions ({ arc, inventory }) {
        if (arc.buckets) {
            const buckets = parseBuckets(arc, "' + process.env.NODE_ENV");
            const cwd = inventory.inv._project.src;
            const { code, types } = createClients(buckets);

            fs.outputFileSync(path.join(cwd, './src/shared/buckets.js'), code);
            fs.outputFileSync(path.join(cwd, './src/shared/buckets.d.ts'), types);
            for (let bucket of buckets.filter(b => b.settings && b.settings.triggers)) {

                const src = path.join(cwd, 'src', 'buckets', bucket.lambda);
                return [ {
                    src,
                    body: 'exports.handler = async function (event) { console.log(event); }'
                } ];
            }
        }
        return [];
    },
    sandbox: {
        async start ({ arc, inventory }) {
            const cwd = inventory.inv._project.src;
            if (arc.buckets) {
                const buckets = parseBuckets(arc, 'testing');
                s3Instance = new S3rver({ configureBuckets: buckets, ...defaultLocalOptions });
                await s3Instance.run();

                s3Instance.on('event', (e) => {
                    const { eventName, s3: { bucket: { name } } } = e.Records[0];
                    const bucket = buckets.find(bucket => bucket.name === name);
                    if (bucket.settings && bucket.settings.triggers && eventName.toLowerCase().includes(bucket.settings.triggers)) {
                        const src = path.join(cwd, 'src', 'buckets', bucket.lambda);
                        invokeLambda({ inventory, src, payload: e }, (e) => {
                            if (e) console.log(e);
                        });
                    }
                });
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
