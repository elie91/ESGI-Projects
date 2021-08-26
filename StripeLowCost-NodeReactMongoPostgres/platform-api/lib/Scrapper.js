const http = require('http');
const https = require('https');
const cheerio = require('cheerio');

const Scrapper = (url, options, processData, saveResult) => {
  const protocol = url.indexOf('https') === 0 ? https : http;

  return protocol.request(url, options, response => {
    if (response.statusCode >= 400) throw "Something went wrong!";

    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      if (response.headers['content-type'].indexOf('json') !== -1) {
        data = JSON.parse(data);
      }
      if (response.headers['content-type'].indexOf('html') !== -1) {
        data = cheerio.load(data);
      }
      data = processData(data);

      saveResult(data);
    })
  });
}

module.exports = Scrapper;
