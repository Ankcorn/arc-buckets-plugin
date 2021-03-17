
declare type client = {
		bucketName: string;
		get(key: any): Promise<{
				contentType: string;
				eTag: string;
				data: string;
		}>;
		put(key: any, blob: any): Promise<void>;
};

declare const buckets: {
		one: client, cats: client, dogs: client
};
	
export = buckets		
