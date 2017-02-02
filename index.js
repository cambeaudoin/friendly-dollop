const Xray = require('x-ray');
const x = Xray();
const fs = require('fs');

// array of sites to test
const resultsArray = [];

// fs file to write to
const fileDest = "results.txt";


// selector to isolate
const selector = x(
    '.rankTable .wsTR', [{
        site: ['td']
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
const temp = function() {
    for (var i = 1; i < 44; i++) {
        // site you want to scrape
        var site = 'https://domaintyper.com/top-websites/most-popular-websites-with-ca-domain/page/' + i;

        x(site, selector)(function (err, data) {
            data.forEach(function (p) {
                console.log(p.site[1]);
                resultsArray.push(p.site[i]);
            })
        })
    }

    writeFile(resultsArray);
}

temp();