# Arc Buckets Plugin (HYPOTHETICAL)

This is a plugin to create and use s3 buckets with arc.codes with one line of configuration per bucket.

It does not work yet. It is just created using the proposed plugin docs as a reference.

https://github.com/architect/arc.codes/pull/324

```arc
@app
my-arc-app

@buckets
bucket-1
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
