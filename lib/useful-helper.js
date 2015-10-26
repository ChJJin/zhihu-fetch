var Promise = require('bluebird'),
    login = require('./api/login'),
    question = require('./api/question'),
    answer = require('./api/answer'),
    collection = require('./api/collection'),
    image = require('./image');

function downloadQuestionImages(questionList){
  if ( !Array.isArray(questionList) ) {
    questionList = [questionList];
  }

  return Promise.reduce(questionList, function(_, qid){
    return question.get(qid).then(_downloadQuestionImages);
  }, 0);
}

function _downloadQuestionImages(q){
  if (!q) return;
  return Promise.reduce(q.answers, function(_, answer){
    return image.download(answer.images, function(url){
      var paths = url.split('/');
      var name = paths[paths.length - 1];
      return 'images/' + parsePath(q.title) + '/' + answer.username + '-' + name;
    });
  }, 0).then(function(){
    console.log('download all images of', q.title);
  });
}

function parsePath(p){
  return p.replace('/', '-')
          .replace('\\', '')
          .replace(':', '：')
          .replace('?', '？')
          .replace('<', '《')
          .replace('>', '》')
          .replace('|', '-')
          .replace('"', '“');
}

module.exports = {
  downloadQuestionImages: downloadQuestionImages
}
