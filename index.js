const Xray = require('x-ray')();
const fs = require('fs');
const request = require('request');
const requestPromise = require('request-promise');
const Q = require('q');

// array of sites to test
const resultsArray = [];

// fs file to write to
const fileDest = "results.txt";

const writeFile = function (fileDest, data) {
    fs.writeFile(fileDest, JSON.stringify(data), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
};

const run = function () {
    for (var i = 1; i < 2; i++) {
        // site you want to scrape
        const site = 'https://domaintyper.com/top-websites/most-popular-websites-with-ca-domain/page/' + i;

        // selector to isolate table values
        const selector = Xray(
            '.rankTable .wsTR', [{
                result: ['td']
            }]
        );

        Xray(site, selector)(function (err, data) {
            var websitesPromises = [];


            for (var i = 0; i < 20; i++) {
              console.log("i: ", i);

              const tr = data[i];
              const urlHttp = `http://www.${tr.result[1]}`;
              const urlHttps = `https://www.${tr.result[1]}`;

              const optionsHttp = {
                  uri: urlHttp,
                  json: true
              };

              const optionsHttps = {
                  uri: urlHttps,
                  json: true
              };

              websitesPromises.push(
                requestPromise(optionsHttp).then(function(ret) {
                  console.log("HTTP: ", optionsHttp.uri);
                  return ret;
                }).catch(function(err) {
                  console.log('ERR: statusCode: ', err.statusCode , " - ", optionsHttp.uri);

                  return requestPromise(optionsHttps).then(function(ret) {
                    console.log("HTTPS: ", optionsHttps.uri);
                  }).catch(function(err) {
                    console.log('ERR: statusCode: ', err.statusCode , " - ", optionsHttps.uri);
                  });

                })
              );

            };

            Q.all(websitesPromises).then(function(websites) {
              console.log("Websites: ", websites);
            });

        });
    }
}


run();
