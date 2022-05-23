const path = require('path');
const fs = require('fs');
const { stdin, stdout } = process;

const PATH = path.join(__dirname, 'text.txt');
const OUTPUT = fs.createWriteStream(PATH);

stdout.write('Hi! Tell me your secrets, i promise i wont tell anyone:3\n')

stdin.on('data', data => {
  if (data.toString().split('\r\n')[0] == 'exit') process.exit();
  OUTPUT.write(data);
});

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => stdout.write('Bye, have a nice journey!(i lied, your secrets\'re in plain view:>)'));