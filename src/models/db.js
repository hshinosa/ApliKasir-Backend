const mysql = require('mysql2/promise');

const createConnection = async () => {
    return await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });
};

const testDatabaseConnection = async () => {
    try {
        const connection = await createConnection();
        console.log('✅ Database connection successful!');
        await connection.end();
    } catch (error) {
        console.error('❌ Failed to connect to the database:');
        console.error(error.message);
    }
};

testDatabaseConnection();

module.exports = createConnection;