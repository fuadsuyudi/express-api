var express = require('express');
var helper = require('../helper.js');
var router = express.Router();
var model = require('../models');

router.post('/', function (req, res, next) {
    model.users.userLogin(req.body, function (err, token) {
        if (err) { res.json(helper.FailResponse(err)) }
        if (token) { res.json(token) }
    });
});

module.exports = router;
