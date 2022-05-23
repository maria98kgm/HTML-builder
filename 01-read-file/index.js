const path = require('path');
const fs = require('fs');

const PATH = path.join(__dirname, 'text.txt');
const READ_STREAM = fs.createReadStream(PATH, 'utf-8');

let fileText = '';

READ_STREAM.on('data', chunk => {
  fileText += chunk;
})

READ_STREAM.on('end', () => console.log(fileText));

















// const fs = require('fs');
// const path = require('path');

// const PATH = path.join(__dirname, 'text.txt');
// const readStream = fs.createReadStream(PATH, 'utf-8');

// let data = '';

// readStream.on('data', chunk => {
//   console.log(chunk);
//   data += chunk;
// });
// readStream.on('end', () => console.log(data));