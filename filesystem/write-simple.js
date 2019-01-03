'use strict';
const fs = require('fs');

fs.writeFile('target.txt', 'hello earth', (err) => {
    if(err) throw err;
});
