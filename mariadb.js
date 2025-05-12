const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '!Leehyerin0316',
    database: 'Youtube',
    dateStrings: true // YYYY-MM-DD HH:MM:SS
});

// A simple SELECT query
// connection.query(
//     'SELECT * FROM `users`',
//     function (err, results, fields) {
//       let {id, email, name, created_at} = results[0];
//       console.log(id);
//       console.log(email);
//       console.log(name);
//       console.log(created_at)
//     }
//   );

  module.exports = connection;
  