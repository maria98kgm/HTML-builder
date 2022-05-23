const fs = require('fs');
const path = require('path');

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
  file_stream.on('data', chunk => data += chunk);
  file_stream.on('end', () => {
    if (num == 0) fs.writeFile(path.join(bundle_path, 'bundle.css'), data, err => {
      if (err) console.error(err.message)
    })
    else fs.appendFile(path.join(bundle_path, 'bundle.css'), data, err => {
      if (err) console.error(err.message)
    })
  });
}
