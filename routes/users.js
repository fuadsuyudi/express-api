var express = require('express');
var router = express.Router();
var helper = require('../helper.js');
var passport = require('passport');
var Strategy = require('passport-http-bearer').Strategy;
var model = require('../models');

/* Configure the Bearer strategy for use by Passport. */
passport.use(new Strategy(
    function (token, cb) {
        model.users.findByToken(token, function (err, user) {
            if (err) { return cb(err); }
            if (!user) { return cb(null, false); }
            return cb(null, user);
        });
    }));

/* GET Unauthorized users. */
router.get('/unauthorized', function (req, res, next) {
    res.json(helper.FailResponse('Unauthorized', 401));
});

/* GET users profile. */
router.get('/', passport.authenticate('bearer', { session: false, failureRedirect: '/users/unauthorized' }), function (req, res, next) {
    model.users.findById(req.user.user_id, function (err, user) {
        if (err) { res.json(helper.FailResponse(err)) }
        if (user) { res.json(helper.SuccessResponse(user)) }
    });
});

/* GET users listing. */
router.get('/all', function (req, res, next) {
    model.users.All(function (err, user) {
        if (err) { res.json(helper.FailResponse(err)); }
        if (user) { res.json(helper.SuccessResponse(user)) }
    });
});

module.exports = router;
