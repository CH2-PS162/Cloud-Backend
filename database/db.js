const mysql = require('mysql2/promise');

// Create a pool using your database configuration
const pool = mysql.createPool({
    host: '34.128.114.28',
    user: 'salsa',
    password: 'cobacoba12345',
    database: 'datalms',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Function to get a database connection
const getConnection = async () => {
    try {
        const connection = await pool.getConnection();
        return connection;
    } catch (err) {
        console.error('Error getting database connection:', err);
        throw err;  // Rethrow the error for caller to handle
    }
};

module.exports = {
    getConnection
};
