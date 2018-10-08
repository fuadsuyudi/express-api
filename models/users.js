var connet = require('./connection.js');
var query = connet.knex;
var moment = require('moment');

const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator(512, UIDGenerator.BASE62);
const bcrypt = require('bcrypt');

exports.findByToken = function (token, cb) {
    query('oauth_access_tokens').first().where({
        token: token
    }).then((rows) => {
        if (rows && rows.token === token) {
            return cb(null, rows);
        } else {
            return cb(null, null);
        }
    }).catch(function (err) {
        return cb(err, null);
    });
}

exports.findByEmail = function (email, cb) {
    query('users').first().where({
        email: email
    }).then((rows) => {
        if (rows && rows.email == email) {
            return cb(null, rows);
        } else {
            return cb(null, null);
        }
    }).catch(function (err) {
        return cb(err, null);
    });
}

exports.findByUsername = function (username, cb) {
    query('users').first().where({
        username: username
    }).then((rows) => {
        if (rows && rows.username == username) {
            return cb(null, rows);
        } else {
            return cb(null, null);
        }
    }).catch(function (err) {
        return cb(err, null);
    });
}

exports.userLogin = function (body, cb) {
    query('users').first().where({
        username: body.username
    }).then((rows) => {
        var expires = moment().add(30, 'd').format('YYYY-MM-DD hh:mm:ss');
        var token = uidgen.generateSync();

        query('oauth_access_tokens').where('user_id', rows.id).update({
            expires_at: expires,
            token: token
        }).then((r) => {
            if (bcrypt.compareSync(body.password, rows.pin)) {
                var row = {
                    'token_type': 'Bearer',
                    'access_token': token,
                    'status': true,
                    'code': 200,
                    'message': 'success login'
                };

                return cb(null, row);
            } else {
                var row = {
                    'token_type': 'Bearer',
                    'access_token': null,
                    'status': false,
                    'code': 200,
                    'message': 'credential invalid'
                };

                return cb(null, row);
            }
        }).catch(function (err) {
            return cb(err, false);
        });
    }).catch(function (err) {
        var row = {
            'token_type': 'Bearer',
            'access_token': null,
            'status': false,
            'code': 200,
            'message': 'credential invalid'
        };

        return cb(null, row);
    });
}

exports.userCreate = function (body, cb) {
    var hash = bcrypt.hashSync(body.password, 10);

    query('users').returning(['id', 'email'])
        .insert([{
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            username: body.username,
            pin: hash,
        }]).then((rows) => {
            query('oauth_access_tokens')
                .insert([{
                    user_id: rows[0],
                }]).then((r) => { }).catch(function (err) { });

            return cb(null, rows);
        }).catch(function (err) {
            return cb(err, null);
        });
}

exports.findById = function (id, cb) {
    query('users').first().where({
        id: id
    }).then((rows) => {
        return cb(null, rows);
    }).catch(function (err) {
        return cb(err, null);
    });
}

exports.All = function (cb) {
    query('users').then((rows) => {
        return cb(null, rows);
    }).catch(function (err) {
        return cb(err, null);
    });
}