var htmltomd = require('to-markdown');

function answerParser($answer){
  var $avatar = $answer.find('.answer-head .zm-item-link-avatar');
  var upvote, username, avatars, content;

  upvote = $answer.find('.zm-votebar .count').text();
  if ($avatar.length > 0) {
    username = $avatar.siblings('a').text();
    avatars = avatarParser($avatar);
  } else {
    username = '匿名用户';
    avatars = {};
  }
  content = htmltomd($answer.find('.zm-item-rich-text .zm-editable-content').html());

  return {
    upvote: upvote,
    username: username,
    avatars: avatars,
    content: content
  }
}

function avatarParser($avatar){
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

module.exports = {
  answer: answerParser,
  avatar: avatarParser
}
