# Arc Buckets Plugin

This is a plugin to create and use s3 buckets with arc.codes with one line of configuration per bucket.

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

