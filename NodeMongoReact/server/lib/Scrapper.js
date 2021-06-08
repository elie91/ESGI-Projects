const http = require('http');
const https = require('https');
const cheerio = require('cheerio');

function Scrapper(url, options, processing, saving) {
  const protocol = url.indexOf('https') === 0 ? https : http;
  const req = protocol.request(url, options, response => {
    if (response.statusCode >= 300) throw 'Status not managed';

    let data = '';
    response.on('data', chunk => {
        data += chunk;
    });

    response.on('end', () => {
      if (response.headers["content-type"].match(/json/)) {
        data = JSON.parse(data);
      }
      if (response.headers["content-type"].match(/html/)) {
        data = cheerio.load(data);
      }

      // Processing
      const result = processing(data, response);
      // Saving
      saving(result);
    });
  });

  this.scrap = ()=> req.end();
}

module.exports = Scrapper;