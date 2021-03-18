
const buckets = require('@architect/shared/buckets');
exports.handler = async function http (req) {
    await buckets.oneTwo.put('hello.txt', JSON.stringify({ message: 'test' }));
    const file = await buckets.oneTwo.get('hello.txt');
    return {
        statusCode: 200,
        headers: {
            'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
            'content-type': 'text/html; charset=utf8'
        },
        body: file.data
    };
}
;
