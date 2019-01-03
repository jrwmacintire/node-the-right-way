const EventEmitter = require('events').EventEmitter;
class LDJClient extends EventEmitter {
    constructor(stream) {
        super();
        let buffer = '';
        if(!stream) {
            throw new Error('Error: stream value was equal to null');
        } else {
            // On 'data' event
            stream.on('data', data => {
                buffer += data;
                let boundary = buffer.indexOf('\n');
                while(boundary !== -1) {
                    const input = buffer.substring(0, boundary);
                    buffer = buffer.substring(boundary + 1);
                    const parsedInput = JSON.parse(input);
                    // console.log(parsedInput);
                    this.emit('message', parsedInput);
                    boundary = buffer.indexOf('\n');
                    // console.log(`input: ${input} ~ parsedInput type: ${typeof parsedInput}`);
                }
            });
            // On 'close' event
            stream.on('close', () => {
                // console.log('Close event occurred');
                if(buffer.length > 0) {
                    this.emit('message', buffer);
                }
                else this.emit('message', 'stream closed!');
            });
        }
    }

    static connect(stream) {
        return new LDJClient(stream);
    }
}

module.exports = LDJClient;
