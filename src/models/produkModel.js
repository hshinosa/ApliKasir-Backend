const createConnection = require('./db');

class Produk {
    static async getAll() {
        const connection = await createConnection();
        const [results] = await connection.query('SELECT * FROM produk');
        await connection.end();
        return results;
    }

    static async getById(id) {
        const connection = await createConnection();
        const [results] = await connection.query('SELECT * FROM produk WHERE id = ?', [id]);
        await connection.end();
        return results;
    }

    static async create(data) {
        const connection = await createConnection();
        const [results] = await connection.query('INSERT INTO produk SET ?', data);
        await connection.end();
        return results;
    }

    static async update(id, data) {
        const connection = await createConnection();
        const [results] = await connection.query('UPDATE produk SET ? WHERE id = ?', [data, id]);
        await connection.end();
        return results;
    }

    static async delete(id) {
        const connection = await createConnection();
        const [results] = await connection.query('DELETE FROM produk WHERE id = ?', [id]);
        await connection.end();
        return results;
    }
}

module.exports = Produk;