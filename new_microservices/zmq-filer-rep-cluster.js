'use strict';
const cluster = require('cluster');
const fs = require('fs');
const zmq = require('zeromq');

const numWorkers = require('os').cpus().length;

if(cluster.isMaster) {
    // Master process creates the ROUTER and DEALER sockets and binds endpoints
    const router = zmq.socket('router').bind('tcp://127.0.0.1:60401');
    const dealer = zmq.socket('dealer').bind('tcp://127.0.0.1:60402');

    // Forward messages between the router and dealer
    router.on('message', (...frames) => dealer.send(frames));
    dealer.on('message', (...frames) => router.send(frames));

    // Listen for workers to come online
    cluster.on('online',
        worker => console.log(`Worker ${worker.process.pid} is online!`)
    );

    // Listen for workers disconnecting
    cluster.on('exit',
        (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} has died with code: ${code}, and signal: ${signal}`);
            console.log('Creating a new worker!');
            cluster.fork();
        }
    );

    // Fork a worker process for each CPU
    for(let i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

} else {
    const responder = zmq.socket('rep').connect('tcp://127.0.0.1:60402');

    // Parse incoming message
    responder.on('message', data => {
        const request = JSON.parse(data);
        console.log(`${process.pid} received request for: ${request.path}.`);
        fs.readFile(request.path, (err, content) => {
            console.log(`${process.pid} sending response`);
            responder.send(JSON.stringify({
                content: content.toString(),
                timestamp: Date.now(),
                pid: process.pid
            }));
        });
    });
}
