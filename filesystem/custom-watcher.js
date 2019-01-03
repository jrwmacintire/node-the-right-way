'use strict';
const fs = require('fs'),
    path = require('path'),
    filename = process.argv[2];


if(!filename) {
    throw Error('A file must be specified.');
}

fs.access(filename, fs.constants.F_OK, (err) => {
    const fileExists = err ? false : true;
    console.log(`${filename} exists: ${fileExists}!`);
    if(err) throw err;
    console.log(`Now watching ${filename} for changes...`);
    fs.watch(filename, () => {
        // console.log(`${filename} changed!`);
        fs.access(filename, fs.constants.F_OK, (err) => {
            if(err) console.log(`\s\s${filename} was deleted!`);
            else console.log(`\s\s${filename} exists`);
        });
    });
});
