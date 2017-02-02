var Xray = require('x-ray');
var x = Xray();
var fs = require('fs');
var http = require('http');

// array of sites to test
const resultsArray = [];

// fs file to write to
const fileDest = "results.txt";

// selector to isolate
const selector = x(
    '.rankTable .wsTR', [{
        result: ['td']
    }]
);

const writeFile = function (data) {
    fs.writeFile(fileDest, JSON.stringify(data), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}
const run = function () {
    for (var i = 1; i < 44; i++) {
        // site you want to scrape
        var site = 'https://domaintyper.com/top-websites/most-popular-websites-with-ca-domain/page/' + i;

        x(site, selector)(function (err, data) {
            data.forEach(function (p) {
                // console.log(p.result[1]);
                resultsArray.push(p.result[1]);
                var req = http.request({host: p.result[1]}, function (res) {
                    res.on('data', function (chunk) {

var potato = JSON.stringify(chunk);
var firstLine = potato.substr(0, potato.indexOf("\n"));


                        console.log({theSite: p.result[1], head: potato});
                    });
                });
                req.on('error', function (e) {
                    console.log('problem with request: ' + e.message);
                });

                req.end();
            })
        })
    }
}


run();