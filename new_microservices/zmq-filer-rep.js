'use strict';
const fs = require('fs');
const zmq = require('zeromq');

// Socket to reply to client requests.
const responder = zmq.socket('rep');

// Handle incoming requests.
responder.on('message', data => {
    // Parse the incoming message.
    const request = JSON.parse(data);
    console.log(`Received request to get: ${request.path}`);

    // Read the file and reply with content.
    fs.readFile(request.path, (err, content) => {
        if(err) {
            console.log(`Invalid filename: ${request.path}`);
            responder.send(JSON.stringify({ error: `Please try re-entering the filename (invalid: ${request.path}).` }));
        } else {
            console.log('Sending response content.');
            responder.send(JSON.stringify({
                content: content.toString(),
                timestamp: Date.now(),
                pid: process.pid
            }));
        }
    });
});

// Listen on TCP port 60401.
responder.bind('tcp://127.0.0.1:60401', err => {
    console.log('Listening for zmq requesters...');
});


process
    .on('SIGINT', () => {
        // Close the responder when the Node process ends.
        console.log('Signal Interrupt - Shutting down responder...');
        responder.close();
    })
    .on('SIGTERM', () => {
        // Close the responsder when the Node process is terminated.
        console.log('Signal Terminated - Shutting down responder...');
        responder.close();
    })
    .on('unhandledRejection', (reason, p) => {
        // Check for uncaught exceptions.
        console.error(reason, 'Unhandled Rejection at Promise', p);
    })
    .on('uncaughtException', err => {
        console.error(err, 'Uncaught Exception thrown');
        responder.close();
        process.exit(1);
    });
