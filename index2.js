const { nextPromisedISSTimes } = require('./iss-promised');

nextPromisedISSTimes()
.then(passes => console.log(passes));