const assert = require('assert');
const maybeFirst = require('../lib/maybe-first');

describe('maybe-first', () => {
    
    it('returns the first element of an array', () => {
        const result = maybeFirst([1,2,3]);
        assert.equal(result, 1, 'maybeFirst([1,2,3]) is 1');
    });

    it('throws an error when an empty array is given', function(){
        assert.throws(() => {
            return maybeFirst([]);
        }, Error, 'empty array throws Error');
    });
});
