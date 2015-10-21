var login = require('./lib/login'),
    question = require('./lib/question'),
    answer = require('./lib/answer');

login().then(function(){
  return answer.get('22515987', '68363008')
}).then(function(a){
  console.log(a);
});
