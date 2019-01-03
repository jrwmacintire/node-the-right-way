'use strict';
const zmq = require('zeromq');
const cluster = require('cluster');

const numWorkers = require('os').cpus().length;
let readyWorkers = 0;

if(cluster.isMaster) {

    // Cluster master worker and puller
    const masterPusher = zmq.socket('push').bind('tcp://127.0.0.1:60401');
    const masterPuller = zmq.socket('pull').bind('tcp://127.0.0.1:60402');

    cluster.on('online',
        worker => {
            console.log(`Worker ${worker.process.pid} is online!`)
            readyWorkers++;
        }
    );

    // Check for worker exits
    cluster.on('exit',
        (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} died! code: ${code}, and signal:  ${signal}`);
            console.log(`Creating a new worker!`);
            cluster.fork();
            // Log current number of workers
            console.log(`Number of current workers available: ${numWorkers}`);
        }
    );

    // Puller events
    masterPuller.on('message', (data) => {
        const job = JSON.parse(data.toString());
        switch(job) {
            case 'ready':
                readyWorkers++;
            case 'result':
                console.log(`job: ${job}`);
        }
    });

    for(let i = 0;i < numWorkers; i++) {
        cluster.fork();
    }

    console.log(`Current number of workers: ${numWorkers}`);

    if(readyWorkers >= 3) {
        console.log(`There are more than 3 workers ready, beginning jobs...`);
        for(let i = 0; i < 30; i++) {
            masterPusher.send(JSON.stringify(
                { details: `details about the job - ${i}` }
            ));
        }
    }

} else {
    // console.log('not the cluster master');

    // Worker puller and pusher
    const workerPuller = zmq.socket('pull').connect('tcp://127.0.0.1:60401');
    const workerPusher = zmq.socket('push').connect('tcp://127.0.0.1:60402');

    workerPuller.on('message', data => {
        const job = JSON.parse(data);
        console.log(`workerPuller(${workerPuller.process.pid}) job: ${job.details}`);
    });

    workerPusher.send(JSON.stringify({ details: 'ready' }));

}
