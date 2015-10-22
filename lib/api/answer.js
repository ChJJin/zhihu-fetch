var cheerio = require('cheerio'),
    request = require('../request'),
    Parser = require('../Parser'),
    config = require('../../config');

function getAnswer(qid, aid){
  var url = parseUrl(qid, aid);
  return request.get(url).then(function(body){
    return cheerio.load(body, {
      decodeEntities: false
    });
  }).then(function($){
    var parser = new Parser($);
    return parser.parseAnswer();
  });
}

function parseUrl(qidOrUrl, aid){
  if ( !aid ) {
    return qidOrUrl;
  } else {
    return config.url.question + qidOrUrl + '/answer/' + aid;
  }
}

module.exports = {
  get: getAnswer
}
