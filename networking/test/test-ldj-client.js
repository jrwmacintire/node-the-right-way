const assert = require('assert');
const EventEmitter = require('events').EventEmitter;
const ldjClient = require('../lib/ldj-client');

describe('LDJClient', () => {

    it('handles close event without error', (done) => {
        const stream = new EventEmitter();
        const client = new ldjClient(stream);
        client.on('message', message => {
            assert.deepEqual(message, 'stream closed!');
            done();
        });
        stream.emit('close');
    });

    it('emits a message event from more than one data event', done => {
        const stream = new EventEmitter();
        const client = new ldjClient(stream);
        client.on('message', message => {
            assert.deepEqual(message, { foo: 'bar' });
            done();
        });
        stream.emit('data', '{"foo"');
        process.nextTick(() => stream.emit('data', ':"bar"}\n'));
    });

    it('throws Error when null value is passed to LDJClient constructor', done => {
        const nullStream = null;
        assert.throws(function() {
            return new ldjClient(nullStream);
        }, Error);
        done();
    });

    it('returns delimiter-less input after "close" event', (done) => {
        const stream = new EventEmitter();
        const client = new ldjClient(stream);
        const buffer = '{ "message": "This message has no delimiter" }';
        stream.emit('data', buffer);
        const timer = setTimeout(() => {
            stream.emit('close');
        }, 200);
        client.on('message', (message) => {
            assert.deepEqual(message, buffer);
            done();
        });
    });

    it('emits a message event from a single data event', done => {
        const stream = new EventEmitter();
        const client = new ldjClient(stream);
        client.on('message', message => {
            assert.deepEqual(message, { foo: 'bar' });
            done();
        });
        stream.emit('data', '{"foo":"bar"}\n');
    });

    it('emits an error when input is invalid JSON', done => {
        const stream = new EventEmitter();
        const client = new ldjClient(stream);
        assert.throws(() => {
            client.on('message', message => {
                return message;
            });
            stream.emit('data', 'This aint JSON\n');
        }, SyntaxError);
        done();
    });

 });
