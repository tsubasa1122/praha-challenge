const express = require('express');
const thirdPartyApp = express();
const thirdPartyAppPort = 8080;

thirdPartyApp.use(
  express.static('src/third-party-app', {
    setHeaders: (res, path, stat) => {
      res.cookie('name', 'hoge', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
    },
  })
);
thirdPartyApp.listen(thirdPartyAppPort, () => {
  console.log(`server started at http://localhost:${thirdPartyAppPort}`);
});

const sampleSite = express();
const sampleSitePort = 8081;

sampleSite.use(
  express.static('src/sample-site', {
    setHeaders: (res, path, stat) => {
      res.cookie('id', 1, { httpOnly: true });
    },
  })
);
sampleSite.listen(sampleSitePort, () => {
  console.log(`server started at http://localhost:${sampleSitePort}`);
});

const postMessageApp = express();
postMessageApp.use(express.static('src/post-message-app'));
postMessageApp.listen(8082, () => {
  console.log('http://localhost:8082');
});

// こちらをngrokでホスティングする。
const postMessageApp2 = express();
postMessageApp2.use(express.static('src/post-message-app2'));
postMessageApp2.listen(8083, () => {
  console.log('http://localhost:8083');
});
