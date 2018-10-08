var express = require('express');
var router = express.Router();
var helper = require('../helper.js');
var model = require('../models');
var service = require('../services');
const { check, validationResult } = require('express-validator/check');
var http = require('http');
const querystring = require('querystring');


// const UIDGenerator = require('uid-generator');
// const uidgen = new UIDGenerator(512, UIDGenerator.BASE62);

// var knex = require('knex')({
//   client: 'mysql',
//   connection: {
//     host: '127.0.0.1',
//     user: 'root',
//     password: 'root',
//     database: 'api_nodejs'
//   }
// });

/* GET home page. */
router.get('/', function (req, res, next) {
    // var ex = uidgen.generateSync();
    // res.send(ex);

    // var ex = uidgen.generate((err, uid) => {
    //   if (err) throw err;

    //   res.send(uid);
    // });

    // uidgen.generate().then(uid => res.send(uid));

    // knex('oauth_access_tokens').where('user_id', '=', 1).update({
    //   token: 123
    // });

    // GET
    // var options = {
    //   host: "pintu-api.festiware.com",
    //   path: "/api/bank/list",
    //   method: 'GET',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   }
    // };

    // callback = function (response) {
    //   var str = '';

    //   //another chunk of data has been recieved, so append it to `str`
    //   response.on('data', function (chunk) {
    //     str += chunk;
    //   });

    //   //the whole response has been recieved, so we just print it out here
    //   response.on('end', function () {
    //     console.log(str);
    //   });
    // }

    // http.request(options, callback).end();

    // POST
    // const postData = querystring.stringify({
    //   'search': 'Mengapa transaksi'
    // });

    // var options = {
    //   host: "pintu-api.festiware.com",
    //   path: "/api/faq/search",
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //     'Content-Length': Buffer.byteLength(postData)
    //   }
    // };

    // callback = function (response) {
    //   var str = '';

    //   //another chunk of data has been recieved, so append it to `str`
    //   response.on('data', function (chunk) {
    //     str += chunk;
    //   });

    //   //the whole response has been recieved, so we just print it out here
    //   response.on('end', function () {
    //     console.log(str);
    //   });
    // }

    // var req = http.request(options, callback);

    // req.write(postData);
    // req.end();

    res.send("Hello fuad..!");
});

router.post('/register', [
    check('first_name')
        .not()
        .isEmpty()
        .withMessage('First Name is required')
        .isLength({ min: 3 })
        .withMessage('must be at least 3 chars long'),
    check('last_name')
        .not()
        .isEmpty()
        .withMessage('Last Name is required')
        .isLength({ min: 3 })
        .withMessage('must be at least 3 chars long'),
    check('email')
        .not()
        .isEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid Email')
        .custom((value, { req }) => {
            return new Promise((resolve, reject) => {
                model.users.findByEmail(value, function (err, valid) {
                    if (err) { reject(new Error('Server Error')); }

                    if (valid) {
                        reject(new Error('E-mail already in use'))
                    } else {
                        resolve(true)
                    }
                });
            });
        }),
    check('username')
        .not()
        .isEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3, max: 20 })
        .withMessage('must be greater than 5 and smaller than 20')
        .custom((value, { req }) => {
            return new Promise((resolve, reject) => {
                model.users.findByUsername(value, function (err, valid) {
                    if (err) { reject(new Error('Server Error')); }

                    if (valid) {
                        reject(new Error('Username already in use'))
                    } else {
                        resolve(true)
                    }
                });
            });
        }),
    check('password')
        .not()
        .isEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6, max: 6 })
        .withMessage('must be 6 character')
], function (req, res, next) {
    const errors = validationResult(req);
    let err_msg = {};
    if (!errors.isEmpty()) {
        Object.keys(errors.mapped()).forEach(field => {
            var param = errors.mapped()[field]['param'];

            err_msg[param] = errors.mapped()[field]['msg'];
        });

        res.json(helper.FailResponse(err_msg));
    } else {
        model.users.userCreate(req.body, function (err, user) {
            if (err) { res.json(helper.FailResponse(err)) }
            if (user) { res.json(helper.SuccessResponse(user)) }
        });
    }
});

router.get('/summaries', function (req, res, next) {
    service.ApiIndodax.GetSummaries(req.query.identifier, function (err, summaries) {
        if (err) { res.json(helper.FailResponse(err)) }
        if (summaries) { res.json(helper.SuccessResponse(summaries)) }
    });
});

module.exports = router;
