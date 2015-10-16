var login = require('./lib/login');

login().then(function(ret){
  console.log('login success', ret);
});
