const express = require('express');

const cacheControlApp = express()
const cacheControlAppPort = 8080;

const cacheOption = {
  maxAge: '1d'
}
cacheControlApp.use('/cache', express.static(__dirname + '/cache', cacheOption));

const noCacheOption = {
  setHeaders: function (res, path, stat) {
    res.set('cache-control', 'no-store')
  }
}
cacheControlApp.use('/no-cache', express.static(__dirname + '/no-cache', noCacheOption));

// expressはデフォルトでCache-Control: max-age=0でETagを設定するようになっており、弱いETagの条件付きのgetを行う
cacheControlApp.use('/condition-get', express.static(__dirname + '/condition-get'));

cacheControlApp.listen(cacheControlAppPort, () => {
  console.log(`server started at http://localhost:${cacheControlAppPort}`);
});

const sampleSite = express()
const sampleSitePort = 8081;
sampleSite.use(express.static(__dirname + '/sample-site'));
sampleSite.listen(sampleSitePort, () => {
  console.log(`server started at http://localhost:${sampleSitePort}`);
});
