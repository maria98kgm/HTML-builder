const fs = require('fs');
const path = require('path');

const templatePath= path.join(__dirname, 'template.html');

let templateStream = fs.createReadStream(templatePath, 'utf-8');
let content = '';

templateStream.on('data', chunk => {
  content += chunk;
})

templateStream.on('end', () => {
  fs.mkdir(path.join(__dirname, 'project-dist'), err => {
    if (err) {
      fs.rmdir(path.join(__dirname, 'project-dist'), {recursive: true}, () => {
        fs.mkdir(path.join(__dirname, 'project-dist'), () => {
          copyHtml();
          bundleCss();
          copyAssets();
        })
      });
    }
    copyHtml();
    bundleCss();
    copyAssets();
  })
})

const copyHtml = () => {
  let splitted = content.split('\r\n');
  for (let i in splitted) {
    if (splitted[i].includes('{')) {
      let tag = splitted[i].split(/{{(.*?)}}/);
      fs.readFile(path.join(__dirname, 'components', `${tag[1]}.html`), 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        let tagData = `${data}`;
        splitted[i] = tagData;
        let ready = splitted.join('\r\n');
        fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), ready, err => {
          if (err) console.error(err.message);
        })
      });   
    }
  }
}

const bundleCss = () => {
  const bundle_path = path.join(__dirname, 'project-dist');
  const css_path = path.join(__dirname, 'styles');
  
  fs.readdir(css_path, (err, files) => {
    if (err) console.error(err.message);
    const all_files = files;
    for (let i in all_files) {
      if (path.extname(all_files[i]) == '.css') editFile(all_files[i], i);
    }
  })
  
  const editFile = (fileName, num) => {
    let data = '';
    const file_stream = fs.createReadStream(path.join(css_path, fileName), 'utf-8');
    file_stream.on('data', chunk => {
      data += chunk;
    });
    file_stream.on('end', () => {
      if (num == 0) fs.writeFile(path.join(bundle_path, 'style.css'), data, err => {
        if (err) console.error(err.message);
      })
      else fs.appendFile(path.join(bundle_path, 'style.css'), data, err => {
        if (err) console.error(err.message)
      })
    });
  }  
}

const copyAssets = () => {
  const fs = require('fs');
  const path = require('path');

  fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), (err) => {
    if (err) {
      fs.rmdir(path.join(__dirname, 'project-dist', 'assets'), {recursive: true}, err_0 => {
        if (err_0) console.error(err_0.message);
        fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), err_1 => {
          if (err_1) console.error(err_1.message);
          copyFiles();
        })
      });
    }
    copyFiles();
  });

  const copyFiles = () => {
    fs.readdir(path.join(__dirname, 'assets'), (err, files) => {
      if (err) console.error(err.message);
      files.forEach(file => fs.copyFile(path.join(__dirname, 'assets', file), path.join(__dirname, 'project-dist', 'assets', file), err => {
        if (err) console.error(err.message);
      }));
    })
  }
}