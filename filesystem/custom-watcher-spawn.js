'use strict';
const fs = require('fs');
const spawn = require('child_process').spawn;
const processToSpawn = process.argv[2];
const filename = process.argv[3];
const processArguments = process.argv.slice(4);

if(!filename) {
    throw Error('ERROR: You must provide a file name');
}

fs.access(filename, fs.constants.F_OK, (err) => {
    const fileExists = err ? false : true;
    console.log(`file exists: ${fileExists}`);
    console.log(`${filename} ${err ? 'does not exist' : 'exists'}`);
    if(fileExists) {
        fs.watch(filename, () => {
            const spawnedProcess = spawn(processToSpawn, [...processArguments]);
            spawnedProcess.stdout.pipe(process.stdout);
        });
    } else {
        throw Error(`ERROR: File cannot be found!`);
    }
});


console.log(`Now watching ${filename} for changes...`);
console.log(`
processToSpawn: ${processToSpawn}
filename: ${filename}
arguments: ${processArguments}
`);
