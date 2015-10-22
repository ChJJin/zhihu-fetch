var cheerio = require('cheerio'),
    request = require('../request'),
    Parser = require('../Parser'),
    config = require('../../config');

function getCollection(url){
  var url = parseUrl(url);
  return getNextPage(url, 1, {});
}

function getSinglePage(url, page, c){
  url = url + '?page=' + page;
  console.log('requesting', url);
  return request.get(url).then(function(body){
    return cheerio.load(body, {
      decodeEntities: false
    });
  }).then(function($){
    var parser = new Parser($);
    return parser.parseCollection(c);
  });
}

function getNextPage(url, page, c){
  return getSinglePage(url, page, c).then(function(_c){
    if (_c) {
      return getNextPage(url, page + 1, _c);
    } else {
      return c;
    }
  })
}

function parseUrl(urlOrId){
  var urlReg = /^(http:\/\/)?www\.zhihu\.com\/collection\/\d+$/;
  if (urlReg.test(urlOrId.trim())) {
    return urlOrId;
  } else {
    return config.url.collection + urlOrId;
  }
}

module.exports = {
  get: getCollection
}
