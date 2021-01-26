const express = require('express');
const cors = require('cors');

const corsApp = express();
const corsAppPort = 8080;

const corsOptions = {
  origin: "http://localhost:8081",
};

corsApp.options('/', cors(corsOptions));
corsApp.post('/', cors(corsOptions), (req, res) => {
  res.json({
    message: 'Request Success'
  });
});
corsApp.listen(corsAppPort, () => {
  console.log(`server started at http://localhost:${corsAppPort}`);
});

const sampleSite = express();
const sampleSitePort = 8081;
sampleSite.use('/', express.static(__dirname + '/sample-site'));
sampleSite.listen(sampleSitePort, () => {
  console.log(`server started at http://localhost:${sampleSitePort}`);
});


const unauthorizedSampleSite = express();
const unauthorizedSampleSitePort = 8082;
unauthorizedSampleSite.use('/', express.static(__dirname + '/unauthorized-sample-site'));
unauthorizedSampleSite.listen(unauthorizedSampleSitePort, () => {
  console.log(`server started at http://localhost:${unauthorizedSampleSitePort}`);
});
