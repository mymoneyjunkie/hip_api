// db.js

const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.HOST, // The public IP or domain of your MySQL server
  user: process.env.USER,
  password: process.env.PASSWORD, // Your database password
  database: process.env.DATABASE_MUSIC,
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

// Handle pool errors
pool.on('error', (err) => {
  console.error('Music Database pool error:', err);
});

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to music database:', err);
    return;
  }
  console.log('Connected to music database successfully');
  connection.release(); // Important: release the connection when done
});

// Export the promise pool
module.exports = promisePool;

// const connection = mysql.createConnection({
//   host: '209.133.194.102', // The public IP or domain of your MySQL server
//   user: 'apihiphopboombox_admin',
//   password: '2!h)]-)Pkv[O', // Your database password
//   database: 'apihiphopboombox_music',
//   port: 3306
// });

// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to music database:', err);
//     return;
//   }
//   console.log('Connected to music database successfully');
// });

// // Export the connection object
// module.exports = connection.promise();