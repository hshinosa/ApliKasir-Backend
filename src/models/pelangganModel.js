const mysql = require('mysql2/promise');
const db = require('./db'); // Pastikan db.js mengembalikan koneksi promise

class Pelanggan {
    static async getAll() {
        const connection = await db();
        const query = 'SELECT * FROM pelanggan';
        const [results] = await connection.query(query);
        return results;
    }

    static async getById(id) {
        const connection = await db();
        const [results] = await connection.query('SELECT * FROM pelanggan WHERE id = ?', [id]);
        return results;
    }

    // Metode baru untuk mendapatkan pelanggan berdasarkan id_pengguna
    static async getByUserId(userId) {
        const connection = await db();
        const query = 'SELECT * FROM pelanggan WHERE id_pengguna = ?'; // Pastikan nama kolom sesuai dengan yang ada di database
        const [results] = await connection.query(query, [userId]);
        return results;
    }

    static async create(data) {
        const connection = await db();
        const [results] = await connection.query('INSERT INTO pelanggan SET ?', data);
        return results;
    }

    static async update(id, data) {
        const connection = await db();
        console.log('Executing Query: UPDATE pelanggan SET ? WHERE id = ?', [data, id]);
        try {
            const [results] = await connection.query('UPDATE pelanggan SET ? WHERE id = ?', [data, id]);
            console.log('Query Result:', results);
            return results;
        } catch (err) {
            console.error('Database Error:', err.message);
            throw new Error(err);
        } finally {
            await connection.end();
        }
    }
    
    static async delete(id) {
        const connection = await db();
        const [results] = await connection.query('DELETE FROM pelanggan WHERE id = ?', [id]);
        return results;
    }
}

module.exports = Pelanggan;