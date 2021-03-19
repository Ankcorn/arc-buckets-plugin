# Arc Buckets Plugin

> [Architect](arc.codes) serverless framework plugin that creates s3 buckets

ALPHA WARNING: this plugin is pretty early in development and everything here is subject to change

This plugin makes it super simple to use aws s3 in an architect project to store files

```arc
@buckets
pictures
```

```javascript
const profilePic = await buckets.pictures.get('ankcorn/profile.jpg')
```

## Installation

1. Install this plugin `npm i arc-buckets-plugin`
2. Add the following line to the @plugins pragma in your Architect project manifest (usually app.arc):

		@plugins
		arc-buckets-plugin

## Usage

Each bucket you define under the `@buckets` section will be created in AWS.

```arc
@buckets
pictures
kittens
```

To do something to bucket use the generated client found at `src/shared/buckets`.

For example:

Add a file to your bucket

```javascript
const buckets = require('@architect/shared/buckets');

async function handler(req) {
	await buckets.kittens.put('list-of-kitten-names.txt', req.body)
}
```

Get a file from your bucket

```javascript
const buckets = require('@architect/shared/buckets');

async function handler(req) {
	return {
		statusCode: 200,
		body: await buckets.kittens.get('list-of-kitten-names.txt');
	}
}
```

### Triggers

Invoking lambdas for ObjectCreated or ObjectRemoved events is supported. To create a lambda that will be invoked for one of these events add triggers to the bucket.

```arc
@buckets
dogs
	triggers create

cats
	triggers remove
```

### Opt out of the client and use the aws-sdk

The generated client found at `@architect/shared/buckets` will cover common usecases but sometimes you need to do something only supported by the aws-sdk. The generated client will still help you set this up correctly and make sure the sandbox works.

```javascript
const buckets = require('@architect/shared/buckets');
const S3 = require('aws-sdk/clients/s3');

const s3 = new S3(buckets.awsConfig);

s3.getObject({ Bucket: buckets.dogs.bucketName, Key: '...' })
```

## TODO

* Add list and delete methods to the client
* Add support for s3 buckets that already exist
* Add suport for bucket visibilty options
