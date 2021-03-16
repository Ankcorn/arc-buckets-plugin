@app
init

@http
get /

@buckets
one 
	# triggers s3:ObjectCreated:*
	visibility private
	# existing true

two
	visibilty public

three

@plugins
arc-buckets-plugin

@aws
profile PERSONAL
region eu-west-1
  