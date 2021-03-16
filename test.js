
const createClients = require('./client');

console.log(createClients([ { bucketName: 'testing-one', clientName: 'one' }, { bucketName: 'testing-two', clientName: 'two' }  ]));
