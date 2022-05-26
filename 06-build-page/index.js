const path = require('path');
const fs =  require('fs');

fs.mkdir(path.join(__dirname, 'project-dist'), err => {
  if (err) {
    fs.rmdir(path.join(__dirname, 'project-dist'), { recursive: true }, () => {
      fs.mkdir(path.join(__dirname, 'project-dist'), () => {
        readTemplate();
        readCss();
        readAssets();
      })
    })
  }
  else {
    readTemplate();
    readCss();
    readAssets();
  }
})

const readTemplate = () => {
  let templateStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  templateStream.on('data', chunk => {
    let splitted = chunk.split('\r\n');
    for (let i in splitted) {
      if (splitted[i].includes('{')) {
        let tag = splitted[i].split(/{{(.*?)}}/).filter(x => !x.includes(' ') && x !== '');
        fs.readFile(path.join(__dirname, 'components', `${tag[0]}.html`), 'utf-8', (err, content) => {
          if (err) console.log(err.message);
          splitted[i] = splitted[i].replace(`{{${tag[0]}}}`, content);
          fs.writeFile(path.join(__dirname, 'project-dist', `index.html`), splitted.join('\r\n'), err => {
            if (err) console.log(err.message);
          })
        })
      }
    }
  })
}

const readCss = () => {
  fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
    if (err) console.log(err.message)
    for (let i in files) {
      if (path.extname(files[i]) == '.css') {
        if (i == 0) {
          fs.readFile(path.join(__dirname, 'styles', files[i]), 'utf8', (err, data) =>{
            if (err) console.log(err.message);
            fs.writeFile(path.join(__dirname, 'project-dist', 'style.css'), data, err => {
              if (err) console.log(err.message);
            })
          })
        }
        else {
          fs.readFile(path.join(__dirname, 'styles', files[i]), 'utf8', (err, data) =>{
            if (err) console.log(err.message);
            fs.appendFile(path.join(__dirname, 'project-dist', 'style.css'), data, err => {
              if (err) console.log(err.message);
            })
          })
        }
      }
    }
  })
}

const readAssets = () => {
  fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), err => {
    if (err) {
      fs.rmdir(path.join(__dirname, 'project-dist', 'assets'), { recursive: true },() => {
        fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), () => {
          copyFiles();
        })
      })
    }
    else copyFiles();
  })
}

const copyFiles = () => {
  fs.readdir(path.join(__dirname, 'assets'), (err, files) => {
    if (err) console.log(err.message);
    for (let i in files) {
      fs.stat(path.join(__dirname, 'assets', files[i]), (err, stat) => {
        if (err) console.log(err.message);
        if (stat.isDirectory()) copyAssetsDirectory(files[i]);
        else if (stat.isFile()) copyAssetsFile(path.join(__dirname, 'project-dist', 'assets', files[i]), path.join(__dirname, 'assets', files[i]));
      })
    }
  })
}

const copyAssetsDirectory = (dir) => {
  fs.mkdir(path.join(__dirname, 'project-dist', 'assets', dir), err => {
    if (err) {
      console.log('first')
      fs.rmdir(path.join(__dirname, 'project-dist', 'assets', dir), { recursive: true }, () => {
        fs.mkdir(path.join(__dirname, 'project-dist', 'assets', dir), () => {
          fs.readdir(path.join(__dirname, 'assets', dir), (err, files) => {
            if (err) console.log(err.message)
            for (let i in files) {
              copyAssets(path.join(__dirname, 'project-dist', 'assets', dir, files[i]), path.join(__dirname, 'assets', dir, files[i]))
            }
          })
        })
      })
    }
    else {
      fs.readdir(path.join(__dirname, 'assets', dir), (err, files) => {
        if (err) console.log(err.message)
        for (let i in files) {
          copyAssets(path.join(__dirname, 'project-dist', 'assets', dir, files[i]), path.join(__dirname, 'assets', dir, files[i]))
        }
      })
    }
  })
}

const copyAssets = (toCopy, fromCopy) => {
  fs.copyFile(fromCopy, toCopy, err => {
    if (err) console.log(err.message);
  })
}
