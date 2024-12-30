const db = require('./db');

class Laporan {
    static async getAll() {
        const connection = await db();
        const query = 'SELECT * FROM laporan';
        const [results] = await connection.query(query);
        return results;
    }

    static async getById(id) {
        const connection = await db();
        const query = 'SELECT * FROM laporan WHERE id = ?';
        const [results] = await connection.query(query, [id]);
        return results;
    }

    static async create(data) {
        const connection = await db();
        const query = 'INSERT INTO laporan SET ?';
        const [results] = await connection.query(query, data);
        return results;
    }

    static async update(id, data) {
        const connection = await db();
        const query = 'UPDATE laporan SET ? WHERE id = ?';
        const [results] = await connection.query(query, [data, id]);
        return results;
    }

    static async delete(id) {
        const connection = await db();
        const query = 'DELETE FROM laporan WHERE id = ?';
        const [results] = await connection.query(query, [id]);
        return results;
    }
}

module.exports = Laporan;
