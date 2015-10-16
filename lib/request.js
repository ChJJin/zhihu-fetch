var request = require('request-promise'),
    FileCookieStore = require('tough-cookie-filestore'),
    fs = require('fs'),
    path = require('path');

var headers = {
  'Host': "www.zhihu.com",
  'Origin': "http://www.zhihu.com",
  'Referer': "http://www.zhihu.com/",
  'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36",
  'X-Requested-With': "XMLHttpRequest",
  'Pragma': "no-cache"
};

var cookiesPath = path.join(process.cwd(), 'cookies.json');
if (!fs.existsSync(cookiesPath)) {
  fs.writeFileSync(cookiesPath, '');
}
var j = request.jar(new FileCookieStore('cookies.json'));

request = request.defaults({
  headers: headers,
  jar: j
});

module.exports = request;
