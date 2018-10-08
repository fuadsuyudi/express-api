var model = require('../models');
var https = require('https');
var moment = require('moment');

exports.GetSummaries = function (identifier, cb) {
    var options = {
        host: "indodax.com",
        path: "/api/summaries",
        method: 'GET'
    };

    callback = function (response) {
        var res = '';

        response.on('data', function (chunk) {
            res += chunk;
        });

        response.on('end', function () {
            var data = JSON.parse(res);
            if (identifier == 'all') {
                cb(null, data.tickers);
            } else {
                cb(null, data.tickers[identifier + '_idr']);
            }
        });
    }

    https.request(options, callback).end();
}