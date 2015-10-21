// var htmltomd = require('to-markdown');

function Parser($){
  if ( !(this instanceof Parser) ) {
    return new Parser($);
  }
  this.$ = $;
}

Parser.prototype.parseQuestion = function (){
  var title, detail, answers;
  var context = this;

  title = this.$('#zh-question-title h2').text().replace(/[\r\n]/g, ''),
  detail = this.$('#zh-question-detail .zm-editable-content').text().replace(/[\r\n]/g, ''),
  answers = this.$('.zm-item-answer').map(function(){
    return context.parseAnswer(context.$(this));
  }).get();

  return {
    title: title,
    detail: detail,
    answers: answers
  };
}

Parser.prototype.parseAnswer = function ($answer){
  if ( !$answer ) {
    $answer = this.$('.zm-item-answer');
  }

  var $avatar = $answer.find('.answer-head .zm-item-link-avatar'),
      $content = $answer.find('.zm-item-rich-text .zm-editable-content');
  var id, upvote, username, avatars, content, images;

  id = $answer.data('atoken');
  upvote = $answer.find('.zm-votebar .count').text();

  if ($avatar.length > 0) {
    username = $avatar.siblings('a').text();
    avatars = this.parseAvatar($avatar);
  } else {
    username = '匿名用户';
    avatars = {};
  }

  if ($content.length > 0) {
    // content = htmltomd($content.html());
    content = $content.html();
    images = this.parseImages($content);
  } else {
    content = '';
    images = [];
  }

  return {
    id: id,
    upvote: upvote,
    username: username,
    avatars: avatars,
    content: content,
    images: images
  };
}

Parser.prototype.parseAvatar = function ($avatar){
  if ( !$avatar.is('img') ){
    $avatar = $avatar.find('img.avatar, img.zm-item-img-avatar, img.zm-list-avatar');
  }

  var baseUrl = $avatar.attr('src').replace(/_\w(\.\w+)$/, '$1');
  function replaceUrl(size){
    return baseUrl.replace(/(\.\w+)$/, '_' + size + '$1');
  }

  var avatars = {max: baseUrl};
  ['s', 'xs', 'm', 'l', 'xl'].forEach(function(size){
    avatars[size] = replaceUrl(size);
  });

  return avatars;
}

Parser.prototype.parseImages = function ($content){
  var $img = $content.children('img');
  var context = this;

  return $img.map(function(){
    return context.$(this).data('original') || context.$(this).data('actualsrc');
  }).get();
}

module.exports = Parser;
