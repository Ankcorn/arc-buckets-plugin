# Arc Buckets Plugin (HYPOTHETICAL)

This is a plugin to create and use s3 buckets with arc.codes with one line of configuration per bucket.

It does not work yet. It is just created using the proposed plugin docs as a reference.

https://github.com/architect/arc.codes/pull/324

```arc
@app
my-arc-app

@buckets
bucket-1 s3:ObjectCreated:*
bucket-2

@http
/hello

@plugins
arc-buckets-plugin
```

To use the buckets you have created you can use this aws-sdk/clients/s3 wrapper included in the module.

```javascript
const { buckets, tableNameHelper } = require('arc-buckets-plugin/client');

buckets.getObject({
  Bucket: tableNameHelper('bucket-1'),
  Key: 'hello.txt'
}).promise().then(data=> console.log(data));

```
s3:GetObject
s3:GetObjectAcl
s3:PutObject
s3:PutObjectAcl
s3:DeleteObject
s3:ListBucket
```
3:TestEvent
	

When a notification is enabled, Amazon S3 publishes a test notification to ensure that the topic exists and that the bucket owner has permission to publish the specified topic.

If enabling the notification fails, you do not receive a test notification.

s3:ObjectCreated:*

s3:ObjectCreated:Put

s3:ObjectCreated:Post

s3:ObjectCreated:Copy

s3:ObjectCreated:CompleteMultipartUpload
	

Amazon S3 APIs such as PUT, POST, and COPY can create an object. With these event types, you can enable notifications when an object is created using a specific API. Or, you can use the s3:ObjectCreated:* event type to request notification regardless of the API that was used to create an object.

You don't receive event notifications from failed operations.

s3:ObjectRemoved:*

s3:ObjectRemoved:Delete

s3:ObjectRemoved:DeleteMarkerCreated
	

By using the ObjectRemoved event types, you can enable notification when an object or a batch of objects is removed from a bucket.

You can request notification when an object is deleted or a versioned object is permanently deleted by using the s3:ObjectRemoved:Delete event type. Or you can request notification when a delete marker is created for a versioned object by using s3:ObjectRemoved:DeleteMarkerCreated. For information about deleting versioned objects, see Deleting object versions from a versioning-enabled bucket. You can also use a wildcard s3:ObjectRemoved:* to request notification anytime an object is deleted.

You don't receive event notifications from automatic deletes from lifecycle policies or from failed operations.

s3:ObjectRestore:Post

s3:ObjectRestore:Completed
	

With restore object event types, you can receive notifications for initiation and completion when restoring objects from the S3 Glacier storage class.

You use s3:ObjectRestore:Post to request notification of object restoration initiation. You use s3:ObjectRestore:Completed to request notification of restoration completion.
s3:ReducedRedundancyLostObject 	You can use this event type to request a notification message when Amazon S3 detects that an object of the RRS storage class is lost.
s3:Replication:OperationFailedReplication 	You receive this notification event when an object that was eligible for replication using S3 Replication Time Control failed to replicate.
s3:Replication:OperationMissedThreshold 	You receive this notification event when an object that was eligible for replication using S3 Replication Time Control exceeds the 15-minute threshold for replication.
s3:Replication:OperationReplicatedAfterThreshold 	You receive this notification event for an object that was eligible for replication using S3 Replication Time Control replicates after the 15-minute threshold.
s3:Replication:OperationNotTracked 	You receive this notification event for an object that was eligible for replication using S3 Replication Time Control but is no longer tracked by replication metrics. 
```


triggers
visibility
existing


methods

list

get

put

delete


```javascript
 const cwd = inventory.inv._project.src;
        return arc.buckets.filter(bucket => bucket.length === 2).map(([ bucket ]) => {
            let rulesSrc = path.join(cwd, 'src', 'buckets', bucket);
            return {
                src: rulesSrc,
                body: `exports.handler = async function (event) {
      console.log(event);
    };`
            };
        });
```
