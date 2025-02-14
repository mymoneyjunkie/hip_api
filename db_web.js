// db.js

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '209.133.194.102', // The public IP or domain of your MySQL server
  user: 'apihiphopboombox_admin',
  password: '2!h)]-)Pkv[O', // Your database password
  database: 'apihiphopboombox_web',
  port: 3306
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to web database:', err);
    return;
  }
  console.log('Connected to web database successfully');
});

// Export the connection object
module.exports = connection.promise();