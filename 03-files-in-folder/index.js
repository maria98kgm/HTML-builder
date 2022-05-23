const fs = require('fs');
const path = require('path');

const PATH = path.join(__dirname, 'secret-folder');

let allFiles;

fs.readdir(PATH, {withFileTypes: true}, (err, files) => {
  if (err) console.error(err.message);
  allFiles = files;
  allFiles.forEach(file =>
    fs.stat(path.join(PATH, 'text.txt'), (err, file_stat) => {
      if (err) console.error(err.message);
      else if (file.isFile()) {
        console.log(path.basename(file.name, path.extname(file.name)), '-' , path.extname(file.name).substring(1, path.extname(file.name).length), '-', file_stat.size * 0.001 + 'kb');
      }
    })
  );
})
