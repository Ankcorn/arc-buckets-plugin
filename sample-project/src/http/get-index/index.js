
const buckets = require('@architect/shared/buckets');

exports.handler = async function http (req) {
    await buckets.one.put('hello.txt', 'hello');
    const file = await buckets.one.get('hello.txt');

    return {
        statusCode: 200,
        headers: {
            'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
            'content-type': 'text/html; charset=utf8'
        },
        body: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Architect</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .max-width-320 {
      max-width: 20rem;
    }
    .margin-left-8 {
      margin-left: 0.5rem;
    }
    .margin-bottom-16 {
      margin-bottom: 1rem;
    }
    .margin-bottom-8 {
      margin-bottom: 0.5rem;
    }
    .padding-32 {
      padding: 2rem;
    }
    .color-grey {
      color: #333;
    }
    .color-black-link:hover {
      color: black;
    }
  </style>
</head>
<body class="padding-32">
 ${file}
</body>
</html>
`
    };
}
;
