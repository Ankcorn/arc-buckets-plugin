const util = require('util');

function start(callback) {
	callback(null,'hi')
}

async function start1() {
	return 'hi'
}

async function runBoth(functions) {
	for(let func of functions) {
		const isAsync = func.constructor.name === "AsyncFunction";
		let unresolvedPromise = isAsync ? func() : util.promisify(func)();
		const result = await unresolvedPromise;
		console.log(result)
	}
}


runBoth([start,start1]);
