'use strict';
const fs = require('fs');
const json = {
    "message": 'Testing with a messge inside JSON'
}
const data = new Uint8Array(Buffer.from(json.toString()));
fs.writeFile('target.txt', data, (err) => {
    if(err) throw err;
    console.log(`File saved!`);
});
