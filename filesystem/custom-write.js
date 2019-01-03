'use strict';
const fs = require('fs');
const filename = process.argv[2];
const text = process.argv[3];

fs.writeFile(filename, text, (err) => {
    if(err) throw err;
});
