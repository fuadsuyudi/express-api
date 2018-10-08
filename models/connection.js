// var mysql = require('mysql');
// var result;
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : 'root',
//   database : 'api_pintu'
// });

// connection.connect();

// exports.cursor = connection;

/* ----------------------------------------------------------------------*/

// exports.raw = function(raw) {
//     return connection.query(raw, function (err, rows, fields) {
//         if (err) console.log(err);

//         connection.end();

//         return rows;
//     });
// }

/* ----------------------------------------------------------------------*/

exports.knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'api_nodejs'
    }
});
