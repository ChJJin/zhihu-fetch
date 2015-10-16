var Promise = require('bluebird'),
    cheerio = require('cheerio'),
    writeFile = Promise.promisify(require('fs').writeFile),
    readline = require('readline'),
    childprocess = require('child_process'),
    request = require('./request'),
    config = require('../config');

function checkLogin(){
  return request.get({
    uri: config.url.profile,
    followRedirect: false
  });
}

function buildPostData(){
  return request.get(config.url.home).then(function(body){
    return cheerio.load(body);
  }).then(function($){
    var postData = {
      _xsrf: $('input[name="_xsrf"]').val(),
      remember_me: true
    };
    return getInput('邮箱是: ').then(function(email){
      postData.email = email;
      return getInput('密码是: ');
    }).then(function(password){
      postData.password = password;
      return getCaptcha();
    }).then(function(captcha){
      postData.captcha = captcha;
      return postData;
    });
  });
}

function getCaptcha(){
  return request.get({
    uri: config.url.captcha,
    qs: {r: Date.now()},
    encoding: 'binary'
  }).then(function(body){
    return writeFile('captcha.gif', body, {encoding: 'binary'}).then(function(){
      childprocess.exec('open captcha.gif');
      return getInput('验证码是: ');
    });
  })
}

function login(){
  return buildPostData().then(function(postData){
    return request.post({
      uri: config.url.login,
      form: postData
    }).then(function(body){
      body = JSON.parse(body);
      if (body.r === 0) {
        return Promise.resolve(body);
      } else {
        return Promise.reject(body);
      }
    });
  });
}

function getInput(info){
  return new Promise(function(resolve, reject){
    var rl = readline.createInterface({input: process.stdin, output: process.stdout});
    rl.question(info, function(answer){
      rl.close();
      resolve(answer);
    });
  });
}

module.exports = function () {
  return checkLogin().catch(login).then(function(body){
    console.log('登录成功');
    return body;
  }).catch(function(err){
    console.log('登录失败', err);
  });
}
