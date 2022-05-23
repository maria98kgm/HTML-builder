const fs = require('fs');
const path = require('path');

fs.mkdir(path.join(__dirname, 'files-copy'), (err) => {
  if (err) {
    fs.rmdir(path.join(__dirname, 'files-copy'), {recursive: true}, err_0 => {
      if (err_0) console.error(err_0.message);
      fs.mkdir(path.join(__dirname, 'files-copy'), err_1 => {
        if (err_1) console.error(err_1.message);
        copyFiles();
      })
    });
  }
  copyFiles();
});

const copyFiles = () => {
  fs.readdir(path.join(__dirname, 'files'), (err, files) => {
    if (err) console.error(err.message);
    files.forEach(file => fs.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file), err => {
      if (err) console.error(err.message);
    }));
  })
}
