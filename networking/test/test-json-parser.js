const assert = require('assert');
const testJSON = require('../lib/testJSON');

describe('testJSON', () => {
     it('returns valid, parsed JSON', () => {
         const result = testJSON('{ "message": "JSON message text" }');
         assert.deepEqual(result, { "message": "JSON message text" });
     });

     it('returns error for invalid JSON input string', () => {
         // const result = testJSON('{ "message": "JSON message text" ');
         // console.log(`result: ${result}`);
        assert.throws(() => {
            return testJSON('{ "message": "JSON message text" ');
        }, SyntaxError);
     });
 });
