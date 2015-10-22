// var htmltomd = require('to-markdown');

function Parser($){
  if ( !(this instanceof Parser) ) {
    return new Parser($);
  }
  this.$ = $;
}

Parser.prototype.parseCollection = function (c){
  if ( !c ) { c = {}; }

  var $answers = this.$('#zh-list-answer-wrap').find('.zm-item');
  var lastQid = null,
      context = this;

  if ( $answers.length == 0 ) {
    return;
  }

  $answers.each(function(){
    var $element = context.$(this);
    var $title = $element.find('.zm-item-title');
    var qid;

    if ( $title.length > 0) {
      qid = $title.find('a').attr('href').replace('/question/', '');
      lastQid = qid;
    } else if ( lastQid ) {
      qid = lastQid;
    } else {
      return;
    }

    if ( !c[qid] ) {
      c[qid] = {
        title: $title.find('a').text(),
        answers: []
      };
    }
    c[qid].answers.push(context.parseAnswer($element.find('.zm-item-answer')).id);
  });

  return c;
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

  var $avatar = $answer.find('.answer-head img.zm-list-avatar'),
      $userLink = $answer.find('.answer-head .zm-item-answer-author-wrap').find('a'),
      $content = $answer.find('.zm-item-rich-text .zm-editable-content'),
      $hiddenContent = $answer.find('.zm-item-rich-text .content.hidden');

  // default value
  var id       = $answer.data('atoken'),
      upvote   = $answer.find('.zm-votebar .count').text(),
      username = '匿名用户' + id,
      avatars  = {},
      content  = '',
      images   = [];

  if ($avatar.length > 0) {
    avatars = this.parseAvatar($avatar);
    username = $avatar.parent().siblings('a').text();
  } else if ( $userLink.length > 0 && $userLink.attr('href').indexOf('/people') == 0 ) {
    username = $userLink.text();
  }

  if ($content.length > 0) {
    // content = htmltomd($content.html());
    content = $content.html();
    images = this.parseImages($content);
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
