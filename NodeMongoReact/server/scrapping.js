const fs = require('fs');
const Scrapper = require('./lib/Scrapper');
const connection = require('./lib/db');
const Cpubench = require('./models/CpuBench');

//const scrapper = new Scrapper(
//  "https://www.cpubenchmark.net/high_end_cpus.html",
//  {},
//  $ => {
//    const result = [];
//    
//    $('#mark .chartlist li').each((index, element) => {
//      const jElement = $(element);
//      const price = jElement.find('span.price-neww').text().trim();
//      const obj = {
//        name: jElement.find('span.prdname').text().trim(),
//        score: jElement.find('span.count').text().trim().replace(',', ''),
//        price: price === "NA" ? null : price.replace(",", '').replace('*', '').substring(1),
//        currency: price === "NA" ? null : price.substring(0,1),
//        rank: (index + 1).toString(),
//        //rank: jElement.find('div.row_details>div:first-child').text().trim().match(/Rank: (\d)+/)[1]
//      };
//      result.push(obj);
//    })
//
//    return result;
//  },
//  result => {
//    //const csvHeader = Object.keys(result[0]).join(',');
//    //const csvBody = result.map(
//    //  item => Object.values(item).map(
//    //    val=> val.match(/,/) ? `"${val}"`: val
//    //  ).join(','));
//    //fs.writeFileSync('./corona.csv', csvHeader + "\n" + csvBody.join("\n"));
//  Promise.all(result.map(item => {
//    const obj = new Cpubench(item);
//    return obj.save();
//  })).then(() => console.log('all data saved'));
//  }
//);
//scrapper.scrap();


Cpubench.mapReduce({
  map: function() {
    emit("moyenne", this.score);
  },
  reduce: function(k, values) {
    return Array.sum(values) / values.length;
  }
}).then(data => console.log(data));