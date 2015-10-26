var cheerio = require('cheerio'),
    request = require('../request'),
    Parser = require('../Parser'),
    config = require('../../config');

function getQuestion(url){
  var url = parseUrl(url);
  return request.get(url).then(function(body){
    return cheerio.load(body, {
      decodeEntities: false
    });
  }).then(function($){
    var parser = new Parser($);
    return parser.parseQuestion();
  }).catch(function(err){
    console.log('request', url, 'with error', err.statusCode);
  });
}

function parseUrl(urlOrId){
  var urlReg = /^(http:\/\/)?www\.zhihu\.com\/question\/\d+$/;
  if (urlReg.test(urlOrId.trim())) {
    return urlOrId;
  } else {
    return config.url.question + urlOrId;
  }
}

module.exports = {
  get: getQuestion
}
