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

Define as many buckets as you want under a `@buckets` section

```arc
@buckets
pictures
kittens
```

To do something to bucket use the generated sdk found at `src/shared/buckets`.

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

## TODO

* Add list and delete methods to the client
* Add support for s3 buckets that already exist
* Add suport for bucket visibilty options
