var fs = require('fs');

function log() {
  console.log.apply(console, arguments);
}

function write(file, content){
  if (typeof content === 'object') {
    content = JSON.stringify(content);
  }
  fs.writeFile(file, content);
}

module.exports = {
  log: log,
  write: write
}
