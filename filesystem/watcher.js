'use strict';
const fs = require('fs');
const filename = process.argv[2];
fs.watch(filename, () => console.log(`${filename} changed!`));
console.log(`Now watching ${filename} for changes...`);
