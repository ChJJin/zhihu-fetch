var Promise = require('bluebird'),
    cheerio = require('cheerio'),
    writeFile = Promise.promisify(require('fs').writeFile),
    request = require('./request'),
    config = require('../config'),
    parser = require('./parser');

function getQuestion(url){
  var url = parseUrl(url);
  return request.get({
    uri: url,
    encoding: 'utf8'
  }).then(function(body){
    return cheerio.load(body, {
      decodeEntities: false
    });
  }).then(function($){
    var answerNum = $('.zh-answers-title h3').data('num');
    console.log(answerNum);
    var answers = $('.zm-item-answer').map(function(){
      return parser.answer($(this));
    }).get();
    console.log(answers[0]);
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
