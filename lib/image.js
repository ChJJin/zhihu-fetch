var Promise = require('bluebird'),
    fs = require('fs'),
    path = require('path'),
    mkdirp = Promise.promisify(require('mkdirp')),
    writeFile = Promise.promisify(require('fs').writeFile),
    request = require('request-promise');

function getImages(urls, getInfo){
  if ( typeof urls === 'string' ){
    urls = [urls];
  }
  if ( !(typeof getInfo === 'function') ) {
    getInfo = getImageInfo;
  }
  return Promise.reduce(urls, function(_, url){
    var imagePath = getInfo(url);
    if ( fs.existsSync(imagePath) ) {
      console.log(imagePath, 'existed');
      return Promise.resolve();
    }
    return downloadImage(url, imagePath);
  }, 0);
}

function getImageInfo(url){
  var paths = url.split('/');
  return paths[paths.length - 1];
}

function downloadImage(url, imagePath){
  return mkdirp(path.dirname(imagePath)).then(function(){
    return new Promise(function(resolve, reject){
      console.log('downloading:', url);
      console.log('will save as', imagePath);
      request.get(url).pipe(fs.createWriteStream(imagePath)).on('finish', function(){
        console.log('download success');
        resolve();
      }).on('error', function(){
        console.log('download something go wrong');
        reject();
      });
    });
  });
}

module.exports = {
  download: getImages
}
