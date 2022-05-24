const path = require('path');
const fs =  require('fs');

let template_data = '';

const templateStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
templateStream.on('data', chunk => template_data += chunk);
templateStream.on('error', err => console.log(err.message));
templateStream.on('end', () => {
  fs.mkdir(path.join(__dirname, 'project-dist'), err => {
    if (err) {
      fs.rmdir(path.join(__dirname, 'project-dist'), () => {
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
})

const readTemplate = () => {
  let lines = template_data.split('\r\n');
  for (let i in lines) {
    if (lines[i].includes('{')) {
      let tag = lines[i].split(/{{(.*?)}}/);
      fs.readFile(path.join(__dirname, 'components', `${tag[1]}.html`), 'utf8', (err, data) => {
        if (err) console.log(err.message);
        lines[i] = data;
        editFile(lines);
      })
    }
  }
}

const editFile = (lines) => {
  let file = lines.join('\r\n');
  fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), file, err => {
    if (err) console.log(err.message)
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
