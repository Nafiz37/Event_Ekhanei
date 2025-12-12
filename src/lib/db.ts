import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // Assuming no password for root locally based on previous commands
    database: 'event_koi',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
