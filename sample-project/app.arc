@app
init

@http
get /

@buckets
one 
	triggers s3:ObjectCreated:*
	visibility private
	existing true

@plugins
arc-buckets-plugin
# @aws
# profile default
# region us-west-1
  