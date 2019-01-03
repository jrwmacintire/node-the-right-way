'use strict';
const fs = require('fs');
const net = require('net');
const filename = process.argv[2];
const port = 60300;

if(!filename) {
    throw Error(`Error: no filename was specified!`);
}

net.createServer(connection => {
    console.log(`Subscriber connected.`);

    const watcher = fs.watch(filename,
        () => connection.write(`File changed: ${new Date()}\n`)
    );

    connection.on('close', () => {
        console.log('Subscriber disconnected.');
        watcher.close();
    });
}).listen(port, () => console.log(`Listening for subscribers on port: ${port}`));
