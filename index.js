var Xray = require('x-ray');
var x = Xray();
var fs = require('fs');

// site you want to scrape
var site = 'http://reddit.com';

// selector to isolate
var selector = '.content';

// fs file to write to
var fileDest = "results.txt";

x(site, selector)(function (err, data) {
    writeFile(data); // Google
    console.log(data);
})

var writeFile = function (data) {
    fs.writeFile(fileDest, data, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
}